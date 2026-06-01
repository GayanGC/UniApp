import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User, Student } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';

/**
 * Users Service
 * Handles all user-related business logic
 */
@Injectable()
export class UsersService {
  private readonly saltRounds: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
  }

  /**
   * Create a new user
   * @param createUserDto - User creation data
   * @returns Created user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    try {
      // Hash password
      const passwordHash = await bcrypt.hash(createUserDto.password, this.saltRounds);

      // Create user entity
      const user = this.userRepository.create({
        email: createUserDto.email,
        passwordHash,
        fullName: createUserDto.fullName,
        role: createUserDto.role,
        isActive: createUserDto.isActive ?? true,
      });

      // Save user
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Create a student profile for a user
   * @param userId - User ID
   * @param university - University name
   * @param faculty - Faculty name
   * @param academicYear - Academic year
   * @returns Created student profile
   */
  async createStudentProfile(
    userId: number,
    university?: string,
    faculty?: string,
    academicYear?: string,
  ): Promise<Student> {
    try {
      const student = this.studentRepository.create({
        userId,
        university,
        faculty,
        academicYear,
      });

      return await this.studentRepository.save(student);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create student profile');
    }
  }

  /**
   * Find all users
   * @returns Array of users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['student'],
      select: {
        userId: true,
        email: true,
        role: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User if found
   */
  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      relations: ['student'],
    });

    return user;
  }

  /**
   * Find user by email
   * @param email - User email
   * @returns User if found
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['student'],
    });

    return user;
  }

  /**
   * Update user
   * @param id - User ID
   * @param updateUserDto - Update data
   * @returns Updated user
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    try {
      // Hash password if being updated
      if (updateUserDto.password) {
        const passwordHash = await bcrypt.hash(updateUserDto.password, this.saltRounds);
        user.passwordHash = passwordHash;
      }

      // Update other fields
      if (updateUserDto.email) user.email = updateUserDto.email;
      if (updateUserDto.fullName) user.fullName = updateUserDto.fullName;
      if (updateUserDto.role) user.role = updateUserDto.role;
      if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Delete user
   * @param id - User ID
   */
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Validate user password
   * @param user - User entity
   * @param password - Plain text password
   * @returns True if password is valid
   */
  async validatePassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.passwordHash);
  }

  /**
   * Update 2FA secret
   */
  async updateTwoFactorSecret(userId: number, secret: string): Promise<void> {
    await this.userRepository.update(userId, { twoFactorSecret: secret });
  }

  /**
   * Enable 2FA for user
   */
  async enableTwoFactor(userId: number): Promise<void> {
    await this.userRepository.update(userId, { isTwoFactorEnabled: true });
  }
}
