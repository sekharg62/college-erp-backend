import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentJwtAuthGuard } from './guards/student-jwt-auth.guard';
import { TeacherJwtAuthGuard } from '../teacher/guards/teacher-jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  AuthenticatedStudent,
  AuthenticatedTeacher,
  StudentService,
} from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('login')
  login(@Body() dto: LoginStudentDto) {
    return this.studentService.login(dto);
  }

  @Get()
  @UseGuards(TeacherJwtAuthGuard)
  findAllByTeacher(@Req() req: { user: AuthenticatedTeacher }) {
    return this.studentService.findAllByTeacher(req.user);
  }

  @Put(':id')
  @UseGuards(TeacherJwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
    @Req() req: { user: AuthenticatedTeacher },
  ) {
    return this.studentService.update(id, dto, req.user);
  }

  @Patch('me')
  @UseGuards(StudentJwtAuthGuard)
  patchMe(
    @Body() dto: PatchStudentDto,
    @Req() req: { user: AuthenticatedStudent },
  ) {
    return this.studentService.patchByStudent(req.user, dto);
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
