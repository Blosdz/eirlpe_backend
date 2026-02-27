import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hostnames')
  async getMyHostnames(@Request() req) {
    const userId = req.user?.sub ?? req.user?.id;
    return this.authService.getUserHostnames(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('hostnames/:userId')
  async getUserHostnames(@Param('userId') userId: number) {
    return this.authService.getUserHostnames(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user?.sub ?? req.user?.id;
    const user = await this.authService.getProfile(userId);
    if (!user) {
      return { success: false, user: null };
    }
    return {
      success: true,
      user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: UpdateProfileDto) {
    const userId = req.user?.sub ?? req.user?.id;
    const user = await this.authService.updateProfile(userId, {
      name: body.name,
      email: body.email,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
      company_name: body.company_name,
      document: body.document,
      phone: body.phone,
      address: body.address,
      ruc_company: body.ruc_company,
    });
    return { success: true, user };
  }
}
