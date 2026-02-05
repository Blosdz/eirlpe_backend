import { IsString, IsEmail, MaxLength } from 'class-validator';

export class LoginTenantUserDto {
  @IsEmail()
  @MaxLength(255)
  mail: string;

  @IsString()
  password: string;
}
