import { User } from '@modules/users/entities';
export declare class PastPaper {
    paperId: number;
    university: string;
    faculty: string;
    subjectName: string;
    academicYear: number;
    examYear: number;
    filePath: string;
    uploadedByUserId: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
    uploadedBy: User;
}
