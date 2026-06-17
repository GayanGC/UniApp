import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { RegisterDto, LoginDto, GoogleLoginDto } from './dto';
import { JwtPayload } from './strategies';
import { UserRole } from '@common/enums';
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
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private oauth2Client;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    googleLogin(googleLoginDto: GoogleLoginDto): Promise<AuthResponse>;
    generateTwoFactorAuthSecret(user: any): Promise<{
        qrCodeDataUrl: string;
    }>;
    turnOnTwoFactorAuthentication(userId: number, code: string): Promise<{
        success: boolean;
    }>;
    authenticate2FA(userId: number, code: string): Promise<AuthResponse>;
    private generateToken;
    validateToken(token: string): Promise<JwtPayload>;
}
