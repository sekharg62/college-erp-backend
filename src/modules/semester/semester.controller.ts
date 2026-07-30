import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { FindSemestersQueryDto } from './dto/find-semesters-query.dto';
import { PatchSemesterDto } from './dto/patch-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { SemesterService } from './semester.service';

@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post()
  create(@Body() dto: CreateSemesterDto) {
    return this.semesterService.create(dto);
  }

  @Get()
  findAllByDepartment(@Query() query: FindSemestersQueryDto) {
    return this.semesterService.findAllByDepartment(query.departmentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.semesterService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSemesterDto,
  ) {
    return this.semesterService.update(id, dto);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PatchSemesterDto,
  ) {
    return this.semesterService.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.semesterService.remove(id);
  }
}
