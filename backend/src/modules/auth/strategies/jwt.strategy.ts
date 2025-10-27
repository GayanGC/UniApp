import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';

/**
 * JWT Payload Interface
 * Defines the structure of the JWT token payload
 */
export interface JwtPayload {
  sub: number; // user_id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT Strategy
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Validates the JWT payload and returns the user
   * @param payload - JWT payload containing user information
   * @returns User object if valid
   * @throws UnauthorizedException if user not found or inactive
   */
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Return user information to be attached to request object
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
