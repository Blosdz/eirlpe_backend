import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HostnamesService } from '../hostnames/hostnames.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private hostnamesService: HostnamesService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, userProfile } = createUserDto;

    try {
      // Validar que email y password no sean nulos o indefinidos
      if (!email || !password) {
        throw new BadRequestException('Email y contraseña son requeridos');
      }

      // Validar hostname
      if (!userProfile.hostname_id) {
        throw new BadRequestException('El hostname es requerido');
      }

      // Validar formato del hostname (solo letras, números y guiones, sin espacios)
      const hostnameValue = userProfile.hostname_id.toLowerCase().trim();
      const hostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

      if (!hostnameRegex.test(hostnameValue)) {
        throw new BadRequestException(
          'El hostname solo puede contener letras minúsculas, números y guiones. No puede comenzar ni terminar con un guión.',
        );
      }

      if (hostnameValue.length < 3 || hostnameValue.length > 63) {
        throw new BadRequestException('El hostname debe tener entre 3 y 63 caracteres');
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.dataSource.query(
        'SELECT * FROM users WHERE email = $1',
        [email],
      );

      if (existingUser.length > 0) {
        throw new BadRequestException('El email ya está registrado');
      }

      // Verificar disponibilidad del hostname
      const hostnameCheck = await this.hostnamesService.checkAvailability(hostnameValue);
      if (!hostnameCheck.available) {
        throw new BadRequestException('El hostname ya está en uso. Por favor elige otro.');
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const userResult = await this.dataSource.query(
        'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
        [email, hashedPassword],
      );

      const userId = userResult[0].id;

      // Crear el hostname (tenant) para el usuario
      const hostname = await this.hostnamesService.registerWithUser(hostnameValue, userId);

      // Crear perfil de usuario
      await this.dataSource.query(
        `INSERT INTO user_profile (users_id, document, phone, company_name, hostname_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userId,
          userProfile.document || null,
          userProfile.phone || null,
          userProfile.company_name || null,
          hostname.id,
        ],
      );

      // Generar token JWT
      const payload = { sub: userId, email: email };
      const access_token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Usuario registrado correctamente',
        access_token,
        user: {
          id: userId,
          email: email,
          name: name,
          userProfile: {
            document: userProfile.document || null,
            phone: userProfile.phone || null,
            company_name: userProfile.company_name || null,
            hostname_id: hostname.id,
            hostname: hostname.hostname,
          },
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Error al registrar usuario');
    }
  }

  async login(email: string, password: string) {
    try {
      // Validar que email y password no sean nulos o indefinidos
      if (!email || !password) {
        throw new UnauthorizedException('Email y contraseña son requeridos');
      }

      const userResult = await this.dataSource.query(
        'SELECT id, email, password FROM users WHERE email = $1',
        [email],
      );

      if (userResult.length === 0) {
        throw new UnauthorizedException('Email o contraseña incorrectos');
      }

      const user = userResult[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Email o contraseña incorrectos');
      }

      // Obtener perfil del usuario
      const profileResult = await this.dataSource.query(
        `SELECT id, document, phone, company_name, hostname_id 
         FROM user_profile 
         WHERE users_id = $1 LIMIT 1`,
        [user.id],
      );

      const userProfile = profileResult.length > 0 ? profileResult[0] : null;

      // Generar token JWT
      const payload = { sub: user.id, email: user.email };
      const access_token = this.jwtService.sign(payload);

      return {
        success: true,
        access_token,
        user: {
          id: user.id,
          email: user.email,
          userProfile: userProfile,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Error al iniciar sesión');
    }
  }

  async getUserHostnames(userId: number) {
    try {
      const hostnames = await this.dataSource.query(
        `SELECT h.id, h.hostname, h.created_at, up.company_name, up.document, up.phone
         FROM hostnames h
         JOIN user_profile up ON h.id = up.hostname_id
         JOIN users u ON up.users_id = u.id
         WHERE u.id = $1
         ORDER BY h.created_at DESC`,
        [userId],
      );

      return hostnames;
    } catch (error) {
      throw new BadRequestException('Error al obtener hostnames');
    }
  }
}
