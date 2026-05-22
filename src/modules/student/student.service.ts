import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { BCRYPT_ROUNDS } from '../../common/constants/auth.constants';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

export type AuthenticatedTeacher = {
  id: string;
  instituteId: string;
  adminId: string;
  departmentId: string;
  name: string;
  phoneNo: string;
};

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto, teacher: AuthenticatedTeacher) {
    if (dto.instituteId !== teacher.instituteId) {
      throw new BadRequestException(
        'instituteId does not match the logged-in teacher',
      );
    }

    if (dto.adminId !== teacher.adminId) {
      throw new BadRequestException(
        'adminId does not match the logged-in teacher',
      );
    }

   /*  await this.ensureInstituteExists(dto.instituteId);
    await this.ensureAdminBelongsToInstitute(dto.adminId, dto.instituteId); */

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const student = await this.prisma.db.student.create({
        data: {
          teacherId: teacher.id,
          adminId: dto.adminId,
          instituteId: dto.instituteId,
          name: dto.name,
          rollNo: dto.rollNo,
          admissionYear: dto.admissionYear,
          password: hashedPassword,
          phoneNo: dto.phoneNo,
        },
      });

      return this.omitPassword(student);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAllByTeacher(teacher: AuthenticatedTeacher) {
    const students = await this.prisma.db.student.findMany({
      where: { teacherId: teacher.id },
      orderBy: { createdAt: 'desc' },
    });

    return students.map((student) => this.omitPassword(student));
  }

  private async ensureInstituteExists(instituteId: string) {
    const institute = await this.prisma.db.institute.findUnique({
      where: { id: instituteId },
    });
    if (!institute) {
      throw new NotFoundException(
        `Institute with id "${instituteId}" not found`,
      );
    }
  }

  private async ensureAdminBelongsToInstitute(
    adminId: string,
    instituteId: string,
  ) {
    const admin = await this.prisma.db.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with id "${adminId}" not found`);
    }
    if (admin.instituteId !== instituteId) {
      throw new BadRequestException(
        'Admin does not belong to the specified institute',
      );
    }
  }

  private omitPassword<T extends { password: string }>(student: T) {
    const { password: _, ...rest } = student;
    return rest;
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Roll number already exists');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Related record not found');
      }
    }
    throw error;
  }
}
