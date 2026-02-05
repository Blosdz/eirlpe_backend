import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TenantUsersService } from './tenant-users.service';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { LoginTenantUserDto } from './dto/login-tenant-user.dto';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { RequireTenant } from '../tenant/decorators/require-tenant.decorator';
import { TenantJwtAuthGuard } from './guards/tenant-jwt-auth.guard';
import { CurrentTenantUser } from './decorators/current-tenant-user.decorator';

@Controller('tenant-users')
@RequireTenant()
@UseGuards(TenantGuard)
export class TenantUsersController {
  constructor(private readonly usersService: TenantUsersService) {}

  @Post('register')
  async register(@Body() dto: CreateTenantUserDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginTenantUserDto) {
    return this.usersService.login(dto);
  }

  @Get('profile')
  @UseGuards(TenantJwtAuthGuard)
  async getProfile(@CurrentTenantUser() user: any) {
    return {
      success: true,
      user: {
        id: user.id,
        mail: user.mail,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        hostname: user.hostname,
      },
    };
  }

  @Get()
  @UseGuards(TenantJwtAuthGuard)
  async findAll(@CurrentTenantUser('role') role: string) {
    if (role !== 'admin') {
      return { success: false, message: 'Admin access required' };
    }
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(TenantJwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentTenantUser('role') role: string,
  ) {
    if (role !== 'admin') {
      return { success: false, message: 'Admin access required' };
    }
    const user = await this.usersService.findById(id);
    return {
      id: user.id,
      mail: user.mail,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  @Patch(':id/status')
  @UseGuards(TenantJwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @CurrentTenantUser('role') role: string,
  ) {
    if (role !== 'admin') {
      return { success: false, message: 'Admin access required' };
    }
    return this.usersService.updateStatus(id, status);
  }

  @Patch(':id/role')
  @UseGuards(TenantJwtAuthGuard)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') newRole: string,
    @CurrentTenantUser('role') role: string,
  ) {
    if (role !== 'admin') {
      return { success: false, message: 'Admin access required' };
    }
    return this.usersService.updateRole(id, newRole);
  }
}
