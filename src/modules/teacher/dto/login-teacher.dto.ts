import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginTeacherDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
