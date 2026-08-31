import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, dto: CreateProjectDto) {
        return this.prisma.project.create({
            data: {
                name: dto.name,
                description: dto.description,
                userId,
            },
        });
    }

    async findAll(userId: number) {
        return this.prisma.project.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: number, userId: number) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                tasks: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async update(
        id: number,
        userId: number,
        dto: UpdateProjectDto,
    ) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return this.prisma.project.update({
            where: {
                id: project.id,
            },
            data: {
                name: dto.name,
                description: dto.description,
            },
        });
    }


    async remove(id: number, userId: number) {
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        if (project._count.tasks > 0) {
            throw new ConflictException(
                'Cannot delete project that contains tasks',
            );
        }

        await this.prisma.project.delete({
            where: {
                id: project.id,
            },
        });

        return {
            message: 'Project deleted successfully',
        };
    }
}