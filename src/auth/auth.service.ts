import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HostnamesService } from '../hostnames/hostnames.service';
import { User, UserProfile } from '../entities';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private hostnamesService: HostnamesService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, userProfile } = createUserDto;

    if (!email || !password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    if (!userProfile.hostname_id) {
      throw new BadRequestException('El hostname es requerido');
    }

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

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hostnameCheck = await this.hostnamesService.checkAvailability(hostnameValue);
    if (!hostnameCheck.available) {
      throw new BadRequestException('El hostname ya está en uso. Por favor elige otro.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    const hostname = await this.hostnamesService.registerWithUser(hostnameValue, savedUser.id);

    const newProfile = new UserProfile();
    newProfile.usersId = savedUser.id;
    newProfile.document = userProfile.document || null;
    newProfile.phone = userProfile.phone || null;
    newProfile.companyName = userProfile.company_name || null;
    newProfile.hostnameId = hostname.id;
    newProfile.rucCompany = userProfile.ruc_company;
    await this.userProfileRepository.save(newProfile);

    const payload = { sub: savedUser.id, email: savedUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      access_token,
      user: {
        id: savedUser.id,
        email: savedUser.email,
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
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const userProfile = await this.userProfileRepository.findOne({
      where: { usersId: user.id },
    });

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
