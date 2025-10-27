import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from './strategies';
import { UserRole } from '@common/enums';

/**
 * Authentication Response Interface
 */
export interface AuthResponse {
  accessToken: string;
  user: {
    userId: number;
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
  };
}

/**
 * Auth Service
 * Handles authentication logic including registration and login
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   * @param registerDto - Registration data
   * @returns Authentication response with JWT token
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user
    const user = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      fullName: registerDto.fullName,
      role: registerDto.role,
      isActive: true,
    });

    // Create student profile if role is student
    if (registerDto.role === UserRole.STUDENT) {
      await this.usersService.createStudentProfile(
        user.userId,
        registerDto.university,
        registerDto.faculty,
        registerDto.academicYear,
      );
    }

    // Generate JWT token
    const accessToken = await this.generateToken(user.userId, user.email, user.role);

    return {
      accessToken,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Login user
   * @param loginDto - Login credentials
   * @returns Authentication response with JWT token
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Validate password
    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = await this.generateToken(user.userId, user.email, user.role);

    return {
      accessToken,
      user: {
        userId: user.userId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Generate JWT access token
   * @param userId - User ID
   * @param email - User email
   * @param role - User role
   * @returns JWT token
   */
  private async generateToken(
    userId: number,
    email: string,
    role: UserRole,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }

  /**
   * Validate JWT token
   * @param token - JWT token
   * @returns Decoded payload if valid
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
