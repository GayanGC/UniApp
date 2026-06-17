import { User } from '../users/entities/user.entity';
export declare class StudyNote {
    note_id: number;
    title: string;
    description: string;
    university: string;
    faculty: string;
    subject_code: string;
    academic_year: number;
    uploaded_by_user_id: number;
    file_path: string;
    is_approved: boolean;
    upload_date: Date;
    uploader: User;
}
