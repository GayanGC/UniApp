import { UserRole } from '@common/enums';
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    fullName?: string;
    role?: UserRole;
    isActive?: boolean;
}
