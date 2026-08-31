import {
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class UpdateProjectDto {
    @ApiPropertyOptional({
    example: 'Updated Project',
    description: 'Project name',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({
    example: 'This is an updated project',
    description: 'Project description',
  })
  @IsOptional()
  @IsString()
  description?: string;
}