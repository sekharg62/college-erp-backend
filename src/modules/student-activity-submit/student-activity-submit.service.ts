import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StudentActivitySubmitStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentActivitySubmitDto } from './dto/create-student-activity-submit.dto';

export type AuthenticatedTeacher = {
  id: string;
  instituteId: string;
  adminId: string;
  departmentId: string;
  name: string;
  phoneNo: string;
};

export type AuthenticatedStudent = {
  id: string;
  instituteId: string;
  adminId: string;
  teacherId: string;
  rollNo: string;
  name: string;
};

@Injectable()
export class StudentActivitySubmitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentActivitySubmitDto, student: AuthenticatedStudent) {
    await this.ensureStudentExists(student.id);

    try {
      return await this.prisma.db.studentActivitySubmit.create({
        data: {
          studentId: student.id,
          activityId: dto.activityId,
          subActivityId: dto.subActivityId,
          academicYear: dto.academicYear,
          points: dto.points,
          proofUrl: dto.proofUrl,
          status: dto.status,
          notes: dto.notes,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAllByStudentAndYear(
    student: AuthenticatedStudent,
    academicYear: string,
  ) {
    return this.prisma.db.studentActivitySubmit.findMany({
      where: {
        studentId: student.id,
        academicYear,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approve(teacher: AuthenticatedTeacher, ids: string[]) {
    const submissions = await this.prisma.db.studentActivitySubmit.findMany({
      where: {
        id: { in: ids },
        student: { teacherId: teacher.id },
      },
      /* include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            admissionYear: true,
          },
        },
      }, */
      orderBy: { createdAt: 'desc' },
    });

    if (submissions.length === 0) {
      throw new NotFoundException('No matching submissions found to approve');
    }

    await this.prisma.db.studentActivitySubmit.updateMany({
      where: { id: { in: submissions.map((s) => s.id) } },
      data: { status: StudentActivitySubmitStatus.APPROVE },
    });

    return submissions.map((submission) => ({
      ...submission,
      status: StudentActivitySubmitStatus.APPROVE,
    }));
  }

  async findAllByTeacherAndYear(
    teacher: AuthenticatedTeacher,
    academicYear: string,
  ) {
    return this.prisma.db.studentActivitySubmit.findMany({
      where: {
        academicYear,
        student: { teacherId: teacher.id },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            phoneNo:true,
            admissionYear: true,
            signature: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async ensureStudentExists(studentId: string) {
    const student = await this.prisma.db.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with id "${studentId}" not found`);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new NotFoundException('Student not found');
      }
    }
    throw error;
  }
}
