import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto, LoginDto, GoogleLoginDto } from './dto';
import { JwtPayload } from './strategies';
import { UserRole } from '@common/enums';
import { OAuth2Client } from 'google-auth-library';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

/**
 * Authentication Response Interface
 */
export interface AuthResponse {
  accessToken?: string;
  requires2FA?: boolean;
  userId?: number;
  user?: {
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
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Note: Use a valid client ID here for production
    this.oauth2Client = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID') || 'YOUR_PLACEHOLDER_CLIENT_ID');
  }

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
    const isPasswordValid = await this.usersService.validatePassword(user, loginDto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if 2FA is required
    if (user.isTwoFactorEnabled) {
      return {
        requires2FA: true,
        userId: user.userId,
      };
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
   * Google OAuth2 Login
   */
  async googleLogin(googleLoginDto: GoogleLoginDto): Promise<AuthResponse> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: googleLoginDto.token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID') || 'YOUR_PLACEHOLDER_CLIENT_ID',
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      let user = await this.usersService.findByEmail(payload.email);
      
      // If user doesn't exist, implicitly register them as STUDENT
      if (!user) {
        user = await this.usersService.create({
          email: payload.email,
          password: Math.random().toString(36).slice(-10), // Random placeholder password
          fullName: payload.name || `${payload.given_name} ${payload.family_name}`,
          role: UserRole.STUDENT,
          isActive: true,
        });

        // Initialize Student profile
        await this.usersService.createStudentProfile(user.userId, 'Unknown', 'Unknown', '1');
      }

      // If they have 2FA enabled, intercept flow
      if (user.isTwoFactorEnabled) {
        return {
          requires2FA: true,
          userId: user.userId,
        };
      }

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
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }

  /**
   * Two-Factor Authentication Generation
   */
  async generateTwoFactorAuthSecret(user: any) {
    const secret = speakeasy.generateSecret({ name: `UniApp (${user.email})` });

    // Save the secret directly
    await this.usersService.updateTwoFactorSecret(user.userId, secret.base32);

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url || '');
    return { qrCodeDataUrl };
  }

  /**
   * Turn On Two-Factor Authentication
   */
  async turnOnTwoFactorAuthentication(userId: number, code: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA secret not generated');
    }

    const isCodeValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.usersService.enableTwoFactor(userId);
    return { success: true };
  }

  /**
   * Authenticate with 2FA code (Login Exchange)
   */
  async authenticate2FA(userId: number, code: string): Promise<AuthResponse> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException('2FA is not enabled for this account');
    }

    const isCodeValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

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
  private async generateToken(userId: number, email: string, role: UserRole): Promise<string> {
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
