import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TenantContactsService } from './tenant-contacts.service';
import { CreateTenantContactDto } from './dto/create-tenant-contact.dto';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { RequireTenant } from '../tenant/decorators/require-tenant.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tenant-contacts')
@RequireTenant()
@UseGuards(TenantGuard)
export class TenantContactsController {
  constructor(private readonly contactsService: TenantContactsService) {}

  @Post()
  async create(@Body() dto: CreateTenantContactDto) {
    return this.contactsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.contactsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactsService.remove(id);
    return { success: true, message: 'Contact deleted successfully' };
  }
}
