import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { PatchInstituteDto } from './dto/patch-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InstituteService } from './institute.service';

@Controller('institutes')
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  @Post()
  create(@Body() dto: CreateInstituteDto) {
    return this.instituteService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateInstituteDto,
  ) {
    return this.instituteService.update(id, dto);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PatchInstituteDto,
  ) {
    return this.instituteService.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.instituteService.remove(id);
  }
}
