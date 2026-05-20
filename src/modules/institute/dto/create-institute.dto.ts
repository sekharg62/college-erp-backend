import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateInstituteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  instituteCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  location: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  contactDetails: string;
}
