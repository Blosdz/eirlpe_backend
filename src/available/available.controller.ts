import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AvailableService } from './available.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('available')
export class AvailableController {
  constructor(private readonly availableService: AvailableService) {}

  @Get('check/:userId')
  async checkAvailability(@Param('userId') userId: number) {
    return this.availableService.checkUserAvailability(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.availableService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyAvailability(@Request() req) {
    return this.availableService.checkUserAvailability(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.availableService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async setAvailability(@Request() req, @Body() body: { available: boolean }) {
    return this.availableService.setAvailability(req.user.id, body.available);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/:userId')
  async setUserAvailability(
    @Param('userId') userId: number,
    @Body() body: { available: boolean },
  ) {
    return this.availableService.setAvailability(userId, body.available);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.availableService.remove(id);
    return { success: true, message: 'Registro eliminado' };
  }
}
