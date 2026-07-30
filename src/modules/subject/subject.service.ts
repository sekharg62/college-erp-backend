import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { PatchSubjectDto } from './dto/patch-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubjectDto) {
    await this.ensureDepartmentExists(dto.departmentId);
    await this.ensureSemesterBelongsToDepartment(
      dto.semesterId,
      dto.departmentId,
    );

    try {
      return await this.prisma.db.subject.create({ data: dto });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(departmentId: string, semesterId?: string) {
    await this.ensureDepartmentExists(departmentId);

    if (semesterId) {
      await this.ensureSemesterBelongsToDepartment(semesterId, departmentId);
    }

    return this.prisma.db.subject.findMany({
      where: {
        departmentId,
        ...(semesterId && { semesterId }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.findOneOrThrow(id);
  }

  async update(id: string, dto: UpdateSubjectDto) {
    await this.findOneOrThrow(id);
    await this.ensureDepartmentExists(dto.departmentId);
    await this.ensureSemesterBelongsToDepartment(
      dto.semesterId,
      dto.departmentId,
    );

    try {
      return await this.prisma.db.subject.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async patch(id: string, dto: PatchSubjectDto) {
    if (Object.keys(dto).length === 0) {
      return this.findOneOrThrow(id);
    }

    const existing = await this.findOneOrThrow(id);
    const departmentId = dto.departmentId ?? existing.departmentId;
    const semesterId = dto.semesterId ?? existing.semesterId;

    await this.ensureDepartmentExists(departmentId);
    await this.ensureSemesterBelongsToDepartment(semesterId, departmentId);

    try {
      return await this.prisma.db.subject.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.db.subject.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private async findOneOrThrow(id: string) {
    const subject = await this.prisma.db.subject.findUnique({
      where: { id },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with id "${id}" not found`);
    }
    return subject;
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

  private async ensureSemesterBelongsToDepartment(
    semesterId: string,
    departmentId: string,
  ) {
    const semester = await this.prisma.db.semester.findFirst({
      where: { id: semesterId, departmentId },
    });
    if (!semester) {
      throw new BadRequestException(
        'Semester does not belong to the specified department',
      );
    }
  }

  private handlePrismaError(error: unknown, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Subject with id "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Subject slug already exists for this semester');
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Department or semester not found');
      }
    }
    throw error;
  }
}
