import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';

@Injectable()
export class TasksService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, createTaskDto: CreateTaskDto) {
        if (createTaskDto.projectId) {
            const project = await this.prisma.project.findFirst({
                where: {
                    id: createTaskDto.projectId,
                    userId,
                },
            });

            if (!project) {
                throw new NotFoundException('Project not found');
            }
        }
        return this.prisma.task.create({
            data: {
                title: createTaskDto.title,
                description: createTaskDto.description,
                priority: createTaskDto.priority,
                dueDate: createTaskDto.dueDate
                    ? new Date(createTaskDto.dueDate)
                    : undefined,
                projectId: createTaskDto.projectId,
                userId,
            },
        });
    }

    async findAll(
        userId: number,
        query: TasksQueryDto,
    ) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const skip = (page - 1) * limit;

        const where = {
            userId,

            ...(query.status && {
                status: query.status,
            }),

            ...(query.priority && {
                priority: query.priority,
            }),

            ...(query.search && {
                OR: [
                    {
                        title: {
                            contains: query.search,
                            mode: 'insensitive' as const,
                        },
                    },
                    {
                        description: {
                            contains: query.search,
                            mode: 'insensitive' as const,
                        },
                    },
                ],
            }),
        };

        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),

            this.prisma.task.count({
                where,
            }),
        ]);

        return {
            data: tasks,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: number, userId: number) {
        return this.prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });
    }


    async update(
        id: number,
        userId: number,
        updateTaskDto: UpdateTaskDto,
    ) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return this.prisma.task.update({
            where: {
                id: task.id,
            },
            data: {
                title: updateTaskDto.title,
                description: updateTaskDto.description,
                status: updateTaskDto.status,
                priority: updateTaskDto.priority,
                dueDate: updateTaskDto.dueDate
                    ? new Date(updateTaskDto.dueDate)
                    : undefined,
            },
        });
    }

    async remove(id: number, userId: number) {
        const task = await this.prisma.task.findFirst({
            where: {
                id,
                userId,
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        await this.prisma.task.delete({
            where: {
                id: task.id,
            },
        });

        return {
            message: 'Task deleted successfully',
        };
    }
}