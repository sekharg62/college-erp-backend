import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { BCRYPT_ROUNDS } from '../../common/constants/auth.constants';
import { StudentJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { PatchStudentDto } from './dto/patch-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

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
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginStudentDto) {
    const student = await this.prisma.db.student.findUnique({
      where: { rollNo: dto.rollNo },
    });

    if (!student) {
      throw new UnauthorizedException('Invalid roll number or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, student.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid roll number or password');
    }

    const payload: StudentJwtPayload = {
      sub: student.id,
      instituteId: student.instituteId,
      adminId: student.adminId,
      teacherId: student.teacherId,
      rollNo: student.rollNo,
      role: 'STUDENT',
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      student: this.omitPassword(student),
    };
  }

  async getMe(student: AuthenticatedStudent) {
    const record = await this.prisma.db.student.findUnique({
      where: { id: student.id },
      select: {
        id: true,
        name: true,
        rollNo: true,
        admissionYear: true,
        phoneNo: true,
        signature: true,
        teacherId: true,
        instituteId: true,
        institute: { select: { name: true } },
        teacher: {
          select: {
            name: true,
            department: { select: { name: true } },
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Student with id "${student.id}" not found`);
    }

    return record;
  }

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

  async update(
    id: string,
    dto: UpdateStudentDto,
    teacher: AuthenticatedTeacher,
  ) {
    await this.findOneForTeacherOrThrow(id, teacher.id);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const student = await this.prisma.db.student.update({
        where: { id },
        data: {
          name: dto.name,
          rollNo: dto.rollNo,
          admissionYear: dto.admissionYear,
          phoneNo: dto.phoneNo,
          password: hashedPassword,
          signature: dto.signature,
        },
      });

      return this.omitPassword(student);
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async patchByStudent(student: AuthenticatedStudent, dto: PatchStudentDto) {
    if (Object.keys(dto).length === 0) {
      const record = await this.findOneOrThrow(student.id);
      return this.omitPassword(record);
    }

    await this.findOneOrThrow(student.id);

    const { password, ...rest } = dto;
    const data: Prisma.StudentUpdateInput = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
    }

    try {
      const record = await this.prisma.db.student.update({
        where: { id: student.id },
        data,
      });

      return this.omitPassword(record);
    } catch (error) {
      this.handlePrismaError(error, student.id);
    }
  }

  private async findOneOrThrow(id: string) {
    const student = await this.prisma.db.student.findUnique({
      where: { id },
    });
    if (!student) {
      throw new NotFoundException(`Student with id "${id}" not found`);
    }
    return student;
  }

  private async findOneForTeacherOrThrow(id: string, teacherId: string) {
    const student = await this.prisma.db.student.findFirst({
      where: { id, teacherId },
    });
    if (!student) {
      throw new NotFoundException(`Student with id "${id}" not found`);
    }
    return student;
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

  private handlePrismaError(error: unknown, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Student with id "${id}" not found`);
      }
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
