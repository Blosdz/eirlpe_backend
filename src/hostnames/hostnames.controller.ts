import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { HostnamesService } from './hostnames.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hostnames')
export class HostnamesController {
  constructor(private readonly hostnamesService: HostnamesService) {}

  /**
   * Check if a hostname is available
   * GET /hostnames/check/:hostname
   */
  @Get('check/:hostname')
  async checkAvailability(@Param('hostname') hostname: string) {
    return this.hostnamesService.checkAvailability(hostname);
  }

  /**
   * Register a new hostname
   * POST /hostnames
   */
  @Post()
  async register(@Body() body: { hostname: string }) {
    return this.hostnamesService.register(body.hostname);
  }

  /**
   * Register hostname with user association (for multi-tenant)
   * POST /hostnames/register-with-user
   */
  @UseGuards(JwtAuthGuard)
  @Post('register-with-user')
  async registerWithUser(@Body() body: { hostname: string; userId: number }) {
    return this.hostnamesService.registerWithUser(body.hostname, body.userId);
  }

  /**
   * Get all hostnames
   * GET /hostnames
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.hostnamesService.findAll();
  }

  /**
   * Get hostname by ID
   * GET /hostnames/:id
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: number) {
    return this.hostnamesService.findById(id);
  }

  /**
   * Update hostname
   * PATCH /hostnames/:id
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: { hostname: string }) {
    return this.hostnamesService.update(id, body.hostname);
  }

  /**
   * Delete hostname
   * DELETE /hostnames/:id
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.hostnamesService.delete(id);
    return { message: 'Hostname deleted successfully' };
  }
}
