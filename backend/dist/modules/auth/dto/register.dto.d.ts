import { UserRole } from '@common/enums';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    university?: string;
    faculty?: string;
    academicYear?: string;
}
