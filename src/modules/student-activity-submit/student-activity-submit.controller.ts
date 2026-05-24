import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudentJwtAuthGuard } from '../student/guards/student-jwt-auth.guard';
import { TeacherJwtAuthGuard } from '../teacher/guards/teacher-jwt-auth.guard';
import { ApproveStudentActivitySubmitsDto } from './dto/approve-student-activity-submits.dto';
import { CreateStudentActivitySubmitDto } from './dto/create-student-activity-submit.dto';
import { FindStudentActivitySubmitsQueryDto } from './dto/find-student-activity-submits-query.dto';
import {
  AuthenticatedStudent,
  AuthenticatedTeacher,
  StudentActivitySubmitService,
} from './student-activity-submit.service';

@Controller('student-activity-submits')
export class StudentActivitySubmitController {
  constructor(
    private readonly studentActivitySubmitService: StudentActivitySubmitService,
  ) {}

  @Get('students')
  @UseGuards(TeacherJwtAuthGuard)
  findAllByTeacherAndYear(
    @Query() query: FindStudentActivitySubmitsQueryDto,
    @Req() req: { user: AuthenticatedTeacher },
  ) {
    return this.studentActivitySubmitService.findAllByTeacherAndYear(
      req.user,
      query.academicYear,
    );
  }

  @Get()
  @UseGuards(StudentJwtAuthGuard)
  findAllByYear(
    @Query() query: FindStudentActivitySubmitsQueryDto,
    @Req() req: { user: AuthenticatedStudent },
  ) {
    return this.studentActivitySubmitService.findAllByStudentAndYear(
      req.user,
      query.academicYear,
    );
  }

  @Post('approve')
  @UseGuards(TeacherJwtAuthGuard)
  approve(
    @Body() dto: ApproveStudentActivitySubmitsDto,
    @Req() req: { user: AuthenticatedTeacher },
  ) {
    return this.studentActivitySubmitService.approve(req.user, dto.ids);
  }

  @Post()
  @UseGuards(StudentJwtAuthGuard)
  create(
    @Body() dto: CreateStudentActivitySubmitDto,
    @Req() req: { user: AuthenticatedStudent },
  ) {
    return this.studentActivitySubmitService.create(dto, req.user);
  }
}
