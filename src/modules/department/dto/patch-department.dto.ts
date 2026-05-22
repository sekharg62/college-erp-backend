import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchDepartmentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
