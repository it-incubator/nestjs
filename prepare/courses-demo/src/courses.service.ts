import {ForbiddenException, Injectable} from '@nestjs/common';
import {CreateCourseDto, UpdateCourseDto} from "./dto/all-dtos";


@Injectable()
export class CourseService {
    private readonly courses = new Map<string, any>();

    private getSessionCourses(sessionId: string) {
        if (!this.courses.has(sessionId)) {
            this.courses.set(sessionId, []);
        }
        return this.courses.get(sessionId);
    }

    create(createCourseDto: CreateCourseDto, sessionId: string) {
        const sessionCourses = this.getSessionCourses(sessionId);
        const course = { id: Date.now().toString(), ...createCourseDto };
        if (sessionCourses.length > 10) throw new ForbiddenException('10 courses is the maximum count');
        sessionCourses.push(course);
        return course;
    }

    findAll(sessionId: string) {
        return this.getSessionCourses(sessionId);
    }

    findOne(id: string, sessionId: string) {
        return this.getSessionCourses(sessionId).find((course: any) => course.id === id);
    }

    update(id: string, updateCourseDto: UpdateCourseDto, sessionId: string) {
        const sessionCourses = this.getSessionCourses(sessionId);
        const courseIndex = sessionCourses.findIndex((course: any) => course.id === id);
        if (courseIndex > -1) {
            sessionCourses[courseIndex] = { ...sessionCourses[courseIndex], ...updateCourseDto };
            return sessionCourses[courseIndex];
        }
        return null;
    }

    remove(id: string, sessionId: string) {
        const sessionCourses = this.getSessionCourses(sessionId);
        const courseIndex = sessionCourses.findIndex((course: any) => course.id === id);
        if (courseIndex > -1) {
            return sessionCourses.splice(courseIndex, 1);
        }
        return null;
    }
}