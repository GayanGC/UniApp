import { UserRole } from '@common/enums';
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    isActive?: boolean;
}
