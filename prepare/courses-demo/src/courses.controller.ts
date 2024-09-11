import {Body, Controller, Delete, Get, Param, Post, Put, Session} from '@nestjs/common';
import { AppService } from './app.service';
import {CourseService} from "./courses.service";
import {CreateCourseDto, UpdateCourseDto} from "./dto/all-dtos";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Throttle} from "@nestjs/throttler";

@ApiTags('courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, description: 'Return all courses' })
  @Get()
  findAll(@Session() session: Record<string, any>) {
    return this.courseService.findAll(session.id);
  }

  @ApiOperation({ summary: 'Get a course by id' })
  @ApiResponse({ status: 200, description: 'Return a course by id' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: Record<string, any>) {
    return this.courseService.findOne(id, session.id);
  }

  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 403, description: 'Course creation limit exceeded' })
  @Post()
  create(@Body() createCourseDto: CreateCourseDto, @Session() session: Record<string, any>) {
    return this.courseService.create(createCourseDto, session.id);
  }

  @ApiOperation({ summary: 'Update a course by id' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Session() session: Record<string, any>) {
    return this.courseService.update(id, updateCourseDto, session.id);
  }

  @ApiOperation({ summary: 'Delete a course by id' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: Record<string, any>) {
    return this.courseService.remove(id, session.id);
  }
}
