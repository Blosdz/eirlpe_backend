import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HostnamesService } from '../hostnames/hostnames.service';
import { User, UserProfile } from '../entities';
import * as bcrypt from 'bcrypt';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private hostnamesService: HostnamesService,
    private jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, userProfile } = createUserDto;

    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      name: name?.trim() || null,
    });
    const savedUser = await this.userRepository.save(newUser);

    // Flujo legacy: si se envía userProfile con hostname_id, crear hostname + perfil en el mismo paso
    if (userProfile?.hostname_id) {
      const hostnameValue = userProfile.hostname_id.toLowerCase().trim();
      const hostnameRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

      if (!hostnameRegex.test(hostnameValue) || hostnameValue.length < 3 || hostnameValue.length > 63) {
        await this.userRepository.remove(savedUser);
        throw new BadRequestException('El hostname solo puede contener letras minúsculas, números y guiones (3-63 chars)');
      }

      const hostnameCheck = await this.hostnamesService.checkAvailability(hostnameValue);
      if (!hostnameCheck.available) {
        await this.userRepository.remove(savedUser);
        throw new BadRequestException('El hostname ya está en uso. Por favor elige otro.');
      }

      const hostname = await this.hostnamesService.registerWithUser(hostnameValue, savedUser.id);

      const newProfile = new UserProfile();
      newProfile.usersId = savedUser.id;
      newProfile.document = userProfile.document;
      newProfile.phone = userProfile.phone;
      newProfile.companyName = userProfile.company_name;
      newProfile.hostnameId = hostname.id;
      newProfile.rucCompany = userProfile.ruc_company ?? '';
      await this.userProfileRepository.save(newProfile);

      const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role || 'user' };
      const access_token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Usuario registrado correctamente',
        access_token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role || 'user',
          name: savedUser.name ?? name ?? undefined,
          userProfile: {
            document: userProfile.document,
            phone: userProfile.phone,
            company_name: userProfile.company_name,
            hostname_id: hostname.id,
            hostname: hostname.hostname,
          },
        },
      };
    }

    // Flujo nuevo (onboarding paso a paso): solo crear el usuario, el hostname se crea después via POST /hostnames
    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role || 'user' };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      access_token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role || 'user',
        name,
      },
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      console.log('Backend AuthService - User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        allKeys: Object.keys(user)
      });
    }

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    // Role fix: ensure role is populated (default to user if missing)
    if (!user.role) {
      user.role = user.email === 'admin@eirl.pe' ? 'admin' : 'user';
    }

    const userProfile = await this.userProfileRepository.findOne({
      where: { usersId: user.id },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? undefined,
        userProfile: userProfile,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'role', 'companyName', 'document', 'phone', 'address', 'rucCompany'],
    });
    if (!user) return null;
    const firstProfile = await this.userProfileRepository.findOne({
      where: { usersId: userId },
      relations: ['hostname'],
      order: { id: 'ASC' },
    });
    // Datos de empresa: del primer perfil (si tiene dominio) o del usuario (si no tiene perfil)
    const profilePayload = firstProfile
      ? {
        id: firstProfile.id,
        company_name: firstProfile.companyName ?? undefined,
        document: firstProfile.document ?? undefined,
        phone: firstProfile.phone ?? undefined,
        address: firstProfile.address ?? undefined,
        ruc_company: firstProfile.rucCompany ?? undefined,
        hostname: firstProfile.hostname?.hostname ?? undefined,
      }
      : {
        company_name: user.companyName ?? undefined,
        document: user.document ?? undefined,
        phone: user.phone ?? undefined,
        address: user.address ?? undefined,
        ruc_company: user.rucCompany ?? undefined,
      };
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      role: user.role,
      profile: profilePayload,
    };
  }

  async updateProfile(
    userId: number,
    dto: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
      company_name?: string;
      document?: string;
      phone?: string;
      address?: string;
      ruc_company?: string;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'password', 'role', 'companyName', 'document', 'phone', 'address', 'rucCompany'],
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    if (dto.name !== undefined) {
      user.name = dto.name?.trim() || null;
    }
    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      if (!email) throw new BadRequestException('El email no puede estar vacío');
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing && existing.id !== userId) {
        throw new BadRequestException('El email ya está en uso');
      }
      user.email = email;
    }
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('La contraseña actual es requerida para cambiar la contraseña');
      }
      const match = await bcrypt.compare(dto.currentPassword, user.password);
      if (!match) {
        throw new BadRequestException('La contraseña actual no es correcta');
      }
      user.password = await bcrypt.hash(dto.newPassword, 10);
    }

    const profileFields = ['company_name', 'document', 'phone', 'address', 'ruc_company'] as const;
    const hasProfileUpdate = profileFields.some((f) => dto[f] !== undefined);

    if (hasProfileUpdate) {
      const profile = await this.userProfileRepository.findOne({
        where: { usersId: userId },
        order: { id: 'ASC' },
      });
      if (profile) {
        if (dto.company_name !== undefined) profile.companyName = dto.company_name?.trim() || undefined;
        if (dto.document !== undefined) profile.document = dto.document?.trim() || undefined;
        if (dto.phone !== undefined) profile.phone = dto.phone?.trim() || undefined;
        if (dto.address !== undefined) profile.address = dto.address?.trim() || undefined;
        if (dto.ruc_company !== undefined) profile.rucCompany = dto.ruc_company?.trim() || undefined;
        await this.userProfileRepository.save(profile);
      } else {
        // Usuario sin dominio: guardar datos de empresa en la tabla users
        if (dto.company_name !== undefined) user.companyName = dto.company_name?.trim() || null;
        if (dto.document !== undefined) user.document = dto.document?.trim() || null;
        if (dto.phone !== undefined) user.phone = dto.phone?.trim() || null;
        if (dto.address !== undefined) user.address = dto.address?.trim() || null;
        if (dto.ruc_company !== undefined) user.rucCompany = dto.ruc_company?.trim() || null;
      }
    }

    await this.userRepository.save(user);

    return this.getProfile(userId);
  }

  async getUserHostnames(userId: number) {
    const profiles = await this.userProfileRepository.find({
      where: { usersId: userId },
      relations: ['hostname'],
    });

    return profiles.map((p) => ({
      id: p.hostname?.id,
      hostname: p.hostname?.hostname,
      created_at: p.hostname?.createdAt,
      company_name: p.companyName,
      document: p.document,
      phone: p.phone,
    }));
  }
}
