import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  departmentCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug: string;
}
