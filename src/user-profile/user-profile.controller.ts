import { Controller, Get, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user-profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  async findAll() {
    return this.userProfileService.findAll();
  }

  @Get('me')
  async getMyProfiles(@Request() req) {
    return this.userProfileService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userProfileService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: number) {
    return this.userProfileService.findByUserId(userId);
  }

  @Get('hostname/:hostnameId')
  async findByHostnameId(@Param('hostnameId') hostnameId: number) {
    return this.userProfileService.findByHostnameId(hostnameId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateDto: UpdateUserProfileDto) {
    return this.userProfileService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.userProfileService.remove(id);
    return { success: true, message: 'Perfil eliminado' };
  }
}
