import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@common/enums';

/**
 * Roles Decorator
 * Specifies which roles are allowed to access a route
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
