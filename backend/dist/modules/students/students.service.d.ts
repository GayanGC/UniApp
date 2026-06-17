import { Repository } from 'typeorm';
import { Student } from '@modules/users/entities';
import { UpdateStudentProfileDto } from './dto';
export declare class StudentsService {
    private readonly studentRepository;
    constructor(studentRepository: Repository<Student>);
    updateProfile(userId: number, updateStudentProfileDto: UpdateStudentProfileDto): Promise<Student>;
    getProfile(userId: number): Promise<Student>;
}
