import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, GoogleLoginDto, Verify2FADto, Authenticate2FADto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    getProfile(user: any): Promise<{
        userId: any;
        email: any;
        role: any;
    }>;
    googleLogin(googleLoginDto: GoogleLoginDto): Promise<AuthResponse>;
    generate2FA(user: any): Promise<{
        qrCodeDataUrl: string;
    }>;
    turnOn2FA(user: any, body: Verify2FADto): Promise<{
        success: boolean;
    }>;
    authenticate2FA(body: Authenticate2FADto): Promise<AuthResponse>;
}
