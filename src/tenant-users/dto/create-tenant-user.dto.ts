import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateTenantUserDto {
  @IsEmail()
  @MaxLength(255)
  mail: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
