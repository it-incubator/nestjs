import { IsString, IsNotEmpty, IsEmail, IsEnum, ValidateNested, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import {ApiProperty, PartialType} from "@nestjs/swagger";
class AuthorDto {
    @ApiProperty({ example: 'Kuzyuberdin' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstName: string;

    @ApiProperty({ example: 'Dmitry' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;

    @ApiProperty({ example: 'it-incubator.io' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    companyName: string;

    @ApiProperty({ example: 'manager@it-incubator.io' })
    @IsEmail()
    email: string;
}

export class CreateCourseDto {
    @ApiProperty({ example: 'Introduction to Back-End' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @ApiProperty({ type: AuthorDto })
    @ValidateNested()
    @Type(() => AuthorDto)
    author: AuthorDto;

    @ApiProperty({ example: '2024-07-01' })
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    lastUpdateDate: string;

    @ApiProperty({ example: 'junior', enum: ['junior', 'middle', 'senior'] })
    @IsEnum(['junior', 'middle', 'senior'])
    targetLevel: 'junior' | 'middle' | 'senior';
}



// dto/update-course.dto.ts

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}