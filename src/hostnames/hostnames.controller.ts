import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { HostnamesService } from './hostnames.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('hostnames')
export class HostnamesController {
  constructor(private readonly hostnamesService: HostnamesService) {}

  @Get('check/:hostname')
  async checkAvailability(@Param('hostname') hostname: string) {
    return this.hostnamesService.checkAvailability(hostname);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.hostnamesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.hostnamesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { hostname: string }, @Request() req: any) {
    const userId: number | undefined = req.user?.sub ?? req.user?.id;
    return this.hostnamesService.create(body.hostname, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: { hostname: string }) {
    return this.hostnamesService.update(id, body.hostname);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.hostnamesService.remove(id);
    return { success: true, message: 'Hostname eliminado' };
  }
}
