import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TeacherJwtAuthGuard extends AuthGuard('teacher-jwt') {}
