import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';

export interface JwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'eirl-pe-secret-key-2026-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    // Verificar que el usuario existe en la base de datos
    const userResult = await this.dataSource.query(
      'SELECT id, email FROM users WHERE id = $1',
      [payload.sub],
    );

    if (userResult.length === 0) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const user = userResult[0];

    // Obtener perfil del usuario
    const profileResult = await this.dataSource.query(
      `SELECT id, document, phone, company_name, hostname_id
       FROM user_profile
       WHERE users_id = $1 LIMIT 1`,
      [user.id],
    );

    const userProfile = profileResult.length > 0 ? profileResult[0] : null;

    // Este objeto estará disponible como req.user en los controladores
    return {
      id: user.id,
      email: user.email,
      userProfile,
    };
  }
}
