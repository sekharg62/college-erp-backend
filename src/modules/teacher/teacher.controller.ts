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
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherJwtAuthGuard } from './guards/teacher-jwt-auth.guard';
import { FindTeachersQueryDto } from './dto/find-teachers-query.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { PatchTeacherDto } from './dto/patch-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { AuthenticatedTeacher, TeacherService } from './teacher.service';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teacherService.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginTeacherDto) {
    return this.teacherService.login(dto);
  }

  @Get()
  findAllByAdmin(@Query() query: FindTeachersQueryDto) {
    return this.teacherService.findAllByAdmin(query.adminId);
  }

  @Get('dashboard')
  @UseGuards(TeacherJwtAuthGuard)
  getDashboard(@Req() req: { user: AuthenticatedTeacher }) {
    return this.teacherService.getDashboard(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.teacherService.update(id, dto);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PatchTeacherDto,
  ) {
    return this.teacherService.patch(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teacherService.remove(id);
  }
}
