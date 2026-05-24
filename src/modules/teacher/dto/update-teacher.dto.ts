import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTeacherDto {
  @IsUUID()
  departmentId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNo?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password?: string;

  @IsString()
  @IsOptional()
  signature?: string;
}
