import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
export class CreateProjectDto {
    @ApiPropertyOptional({
    example: 'New Project',
    description: 'Project name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;
  
  @ApiPropertyOptional({
    example: 'This is a new project',
    description: 'Project description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}