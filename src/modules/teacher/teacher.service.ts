import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { BCRYPT_ROUNDS } from '../../common/constants/auth.constants';
import { TeacherJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { PatchTeacherDto } from './dto/patch-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

export type AuthenticatedTeacher = {
  id: string;
  instituteId: string;
  adminId: string;
  departmentId: string;
  name: string;
  phoneNo: string;
};

@Injectable()
export class TeacherService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateTeacherDto) {
    await this.ensureInstituteExists(dto.instituteId);
    await this.ensureAdminBelongsToInstitute(dto.adminId, dto.instituteId);
    await this.ensureDepartmentExists(dto.departmentId);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const teacher = await this.prisma.db.teacher.create({
        data: {
          instituteId: dto.instituteId,
          adminId: dto.adminId,
          departmentId: dto.departmentId,
          name: dto.name,
          phoneNo: dto.phoneNo,
          password: hashedPassword,
        },
      });

      return this.omitPassword(teacher);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async login(dto: LoginTeacherDto) {
    const teacher = await this.prisma.db.teacher.findFirst({
      where: { phoneNo: dto.phoneNo },
    });

    if (!teacher) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, teacher.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const payload: TeacherJwtPayload = {
      sub: teacher.id,
      instituteId: teacher.instituteId,
      adminId: teacher.adminId,
      departmentId: teacher.departmentId,
      role: 'TEACHER',
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      teacher: this.omitPassword(teacher),
    };
  }

  async findAllByAdmin(adminId: string) {
    await this.ensureAdminExists(adminId);

    const teachers = await this.prisma.db.teacher.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
    });

    return teachers.map((teacher) => this.omitPassword(teacher));
  }

  async findOne(id: string) {
    const teacher = await this.findOneOrThrow(id);
    return this.omitPassword(teacher);
  }

  async update(id: string, dto: UpdateTeacherDto) {
    await this.findOneOrThrow(id);
    await this.ensureDepartmentExists(dto.departmentId);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const teacher = await this.prisma.db.teacher.update({
        where: { id },
        data: {
          departmentId: dto.departmentId,
          name: dto.name,
          phoneNo: dto.phoneNo,
          password: hashedPassword,
        },
      });

      return this.omitPassword(teacher);
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async patch(id: string, dto: PatchTeacherDto) {
    if (Object.keys(dto).length === 0) {
      return this.findOne(id);
    }

    await this.findOneOrThrow(id);

    if (dto.departmentId) {
      await this.ensureDepartmentExists(dto.departmentId);
    }

    const { password, ...rest } = dto;
    const data: Prisma.TeacherUpdateInput = { ...rest };

    if (password) {
      data.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
    }

    try {
      const teacher = await this.prisma.db.teacher.update({
        where: { id },
        data,
      });

      return this.omitPassword(teacher);
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: string) {
    try {
      const teacher = await this.prisma.db.teacher.delete({ where: { id } });
      return this.omitPassword(teacher);
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private async findOneOrThrow(id: string) {
    const teacher = await this.prisma.db.teacher.findUnique({
      where: { id },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id "${id}" not found`);
    }
    return teacher;
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

  private async ensureAdminExists(adminId: string) {
    const admin = await this.prisma.db.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with id "${adminId}" not found`);
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

  private async ensureDepartmentExists(departmentId: string) {
    const department = await this.prisma.db.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(
        `Department with id "${departmentId}" not found`,
      );
    }
  }

  async getDashboard(teacher: AuthenticatedTeacher) {
    const record = await this.prisma.db.teacher.findUnique({
      where: { id: teacher.id },
      select: {
        id: true,
        name: true,
        phoneNo: true,
        instituteId: true,
        adminId: true,
        institute: {
          select: { id: true, name: true },
        },
        admin: {
          select: { id: true, name: true },
        },
        department: {
          select: { id: true, name: true },
        },
        
      },
    });

    if (!record) {
      throw new NotFoundException(`Teacher with id "${teacher.id}" not found`);
    }

    const { department, institute, admin, ...teacherInfo } = record;

    return {
      teacher: {
        ...teacherInfo,
        institute,
        admin,
        department,
      },
    };
  }

  private omitPassword<T extends { password: string }>(teacher: T) {
    const { password: _, ...rest } = teacher;
    return rest;
  }

  private handlePrismaError(error: unknown, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Teacher with id "${id}" not found`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Related record not found');
      }
    }
    throw error;
  }
}
