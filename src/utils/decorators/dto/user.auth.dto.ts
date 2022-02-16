import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserAuth {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
