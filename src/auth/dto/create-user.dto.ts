import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserProfileDto {
  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsNotEmpty({ message: 'El hostname es requerido' })
  @IsString()
  @MinLength(3, { message: 'El hostname debe tener al menos 3 caracteres' })
  hostname_id: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => UserProfileDto)
  userProfile: UserProfileDto;
}
