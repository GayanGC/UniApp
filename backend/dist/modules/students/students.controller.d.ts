import { StudentsService } from './students.service';
import { UpdateStudentProfileDto } from './dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    updateProfile(updateStudentProfileDto: UpdateStudentProfileDto, userId: number): Promise<import("../users/entities").Student>;
    getProfile(userId: number): Promise<import("../users/entities").Student>;
}
