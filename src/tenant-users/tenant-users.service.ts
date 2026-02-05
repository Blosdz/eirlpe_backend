import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TenantContextService } from '../tenant/tenant-context.service';
import { TenantUser } from '../tenant-entities';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { LoginTenantUserDto } from './dto/login-tenant-user.dto';

export interface TenantJwtPayload {
  sub: number;
  mail: string;
  tenantId: number;
  hostname: string;
  type: 'tenant_user';
}

@Injectable()
export class TenantUsersService {
  constructor(
    private readonly tenantContextService: TenantContextService,
    private readonly jwtService: JwtService,
  ) {}

  private getRepository() {
    const connection = this.tenantContextService.getConnection();
    if (!connection) {
      throw new BadRequestException('Tenant connection not available');
    }
    return connection.getRepository(TenantUser);
  }

  async register(dto: CreateTenantUserDto): Promise<{ user: Partial<TenantUser>; access_token: string }> {
    const tenantId = this.tenantContextService.getTenantId();
    const hostname = this.tenantContextService.getHostname();

    if (!tenantId || !hostname) {
      throw new BadRequestException('Tenant not specified');
    }

    const repository = this.getRepository();

    const existing = await repository.findOne({
      where: { mail: dto.mail },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = repository.create({
      mail: dto.mail,
      password: hashedPassword,
      name: dto.name,
      role: 'user',
      status: 'active',
    });

    const savedUser = await repository.save(user);

    const payload: TenantJwtPayload = {
      sub: savedUser.id,
      mail: savedUser.mail,
      tenantId,
      hostname,
      type: 'tenant_user',
    };

    return {
      user: {
        id: savedUser.id,
        mail: savedUser.mail,
        name: savedUser.name,
        role: savedUser.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(dto: LoginTenantUserDto): Promise<{ user: Partial<TenantUser>; access_token: string }> {
    const tenantId = this.tenantContextService.getTenantId();
    const hostname = this.tenantContextService.getHostname();

    if (!tenantId || !hostname) {
      throw new BadRequestException('Tenant not specified');
    }

    const repository = this.getRepository();

    const user = await repository.findOne({
      where: { mail: dto.mail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('User inactive or suspended');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await repository.save(user);

    const payload: TenantJwtPayload = {
      sub: user.id,
      mail: user.mail,
      tenantId,
      hostname,
      type: 'tenant_user',
    };

    return {
      user: {
        id: user.id,
        mail: user.mail,
        name: user.name,
        role: user.role,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(): Promise<Partial<TenantUser>[]> {
    const repository = this.getRepository();
    const users = await repository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => ({
      id: user.id,
      mail: user.mail,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }));
  }

  async findById(id: number): Promise<TenantUser> {
    const repository = this.getRepository();
    const user = await repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByMail(mail: string): Promise<TenantUser | null> {
    const repository = this.getRepository();
    return repository.findOne({ where: { mail } });
  }

  async updateStatus(id: number, status: string): Promise<TenantUser> {
    const user = await this.findById(id);
    user.status = status;

    const repository = this.getRepository();
    return repository.save(user);
  }

  async updateRole(id: number, role: string): Promise<TenantUser> {
    const user = await this.findById(id);
    user.role = role;

    const repository = this.getRepository();
    return repository.save(user);
  }
}
