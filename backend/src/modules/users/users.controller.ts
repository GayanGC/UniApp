import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '@modules/auth/guards';
import { Roles, CurrentUser } from '@common/decorators';
import { UserRole } from '@common/enums';

/**
 * Users Controller
 * Handles user CRUD operations
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   * POST /api/v1/users
   * Only accessible by admins
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  /**
   * Get all users
   * GET /api/v1/users
   * Only accessible by admins
   */
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * Get user by ID
   * GET /api/v1/users/:id
   * Admins can view any user, others can only view themselves
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
  ) {
    // Check if user is admin or viewing their own profile
    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new Error('Unauthorized to view this user');
    }

    return await this.usersService.findById(id);
  }

  /**
   * Update user
   * PATCH /api/v1/users/:id
   * Admins can update any user, others can only update themselves
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    // Check if user is admin or updating their own profile
    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new Error('Unauthorized to update this user');
    }

    return await this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete user
   * DELETE /api/v1/users/:id
   * Only accessible by admins
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
  }
}
