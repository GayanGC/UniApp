import { UserRole } from '@common/enums';
import { Student } from './student.entity';
export declare class User {
    userId: number;
    email: string;
    passwordHash: string;
    role: UserRole;
    fullName: string;
    isActive: boolean;
    isTwoFactorEnabled: boolean;
    twoFactorSecret: string;
    createdAt: Date;
    updatedAt: Date;
    student?: Student;
}
