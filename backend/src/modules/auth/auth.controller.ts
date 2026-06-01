import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, GoogleLoginDto, Verify2FADto, Authenticate2FADto } from './dto';
import { Public, CurrentUser } from '@common/decorators';
import { JwtAuthGuard } from './guards';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

/**
 * Auth Controller
 * Handles authentication endpoints
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(registerDto);
  }

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return await this.authService.login(loginDto);
  }

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   * Requires authentication
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile returned.' })
  async getProfile(@CurrentUser() user: any) {
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Google OAuth2 Login
   * POST /api/v1/auth/google
   */
  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Google OAuth2' })
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto): Promise<AuthResponse> {
    return await this.authService.googleLogin(googleLoginDto);
  }

  /**
   * Generate 2FA Secret and QR Code
   * POST /api/v1/auth/2fa/generate
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate TOTP secret and QR code' })
  async generate2FA(@CurrentUser() user: any) {
    return await this.authService.generateTwoFactorAuthSecret(user);
  }

  /**
   * Turn On 2FA
   * POST /api/v1/auth/2fa/turn-on
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Turn on 2FA by verifying the first code' })
  async turnOn2FA(@CurrentUser() user: any, @Body() body: Verify2FADto) {
    return await this.authService.turnOnTwoFactorAuthentication(user.userId, body.code);
  }

  /**
   * Authenticate 2FA (Exchange Code for JWT)
   * POST /api/v1/auth/2fa/authenticate
   */
  @Public()
  @Post('2fa/authenticate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exchange 2FA code for JWT token' })
  async authenticate2FA(@Body() body: Authenticate2FADto): Promise<AuthResponse> {
    return await this.authService.authenticate2FA(Number(body.userId), body.code);
  }
}
