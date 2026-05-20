import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchInstituteDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  instituteCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  contactDetails?: string;
}
