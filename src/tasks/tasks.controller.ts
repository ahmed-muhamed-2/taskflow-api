import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Patch,
    Req,
    UseGuards,
    Delete,
    Query,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('api/tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Req() req: Request,
        @Body() createTaskDto: CreateTaskDto,
    ) {
        return this.tasksService.create(
            req['user'].userId,
            createTaskDto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: Request, @Query() query: TasksQueryDto) {
        return this.tasksService.findAll(req['user'].userId, query);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        const task = this.tasksService.findOne(
            Number(id),
            req['user'].userId,
        );

        if (!task) {
            throw new NotFoundException(`Task not found`);
        }
        return task;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Req() req: Request,
        @Body() updateTaskDto: UpdateTaskDto,
    ) {
        return this.tasksService.update(
            Number(id),
            req['user'].userId,
            updateTaskDto,
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        return this.tasksService.remove(
            Number(id),
            req['user'].userId,
        );
    }
}