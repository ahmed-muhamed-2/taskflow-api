import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('api/projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Req() req: Request,
        @Body() dto: CreateProjectDto,
    ) {
        return this.projectsService.create(
            req['user'].userId,
            dto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: Request) {
        return this.projectsService.findAll(req['user'].userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        return this.projectsService.findOne(
            Number(id),
            req['user'].userId,
        );
    }


    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id') id: string,
        @Req() req: Request,
        @Body() dto: UpdateProjectDto,
    ) {
        return this.projectsService.update(
            Number(id),
            req['user'].userId,
            dto,
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id') id: string,
        @Req() req: Request,
    ) {
        return this.projectsService.remove(
            Number(id),
            req['user'].userId,
        );
    }
}