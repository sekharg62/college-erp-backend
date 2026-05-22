import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TeacherJwtAuthGuard } from '../teacher/guards/teacher-jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import {
  AuthenticatedTeacher,
  StudentService,
} from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @UseGuards(TeacherJwtAuthGuard)
  findAllByTeacher(@Req() req: { user: AuthenticatedTeacher }) {
    return this.studentService.findAllByTeacher(req.user);
  }

  @Post()
  @UseGuards(TeacherJwtAuthGuard)
  create(
    @Body() dto: CreateStudentDto,
    @Req() req: { user: AuthenticatedTeacher },
  ) {
    return this.studentService.create(dto, req.user);
  }
}
