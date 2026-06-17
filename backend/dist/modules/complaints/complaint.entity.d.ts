import { User } from '@modules/users/entities';
export declare enum ComplaintStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    RESOLVED = "RESOLVED"
}
export declare class Complaint {
    id: string;
    title: string;
    description: string;
    category: string;
    status: ComplaintStatus;
    studentId: number;
    createdAt: Date;
    student: User;
}
