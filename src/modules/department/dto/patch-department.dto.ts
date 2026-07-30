import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchDepartmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  departmentCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;
}
