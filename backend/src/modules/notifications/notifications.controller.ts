import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { UserRole } from '@common/enums';

@Controller('api/v1/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @Get('my-feed')
  async getMyFeed(@Req() req: any) {
    const userId = req.user.user_id;
    const user = await this.usersService.findById(userId);
    if (!user || !user.student) {
      throw new Error('Student profile not found');
    }
    const profile = {
      university: user.student.university,
      faculty: user.student.faculty,
      academic_year: Number(user.student.academicYear),
    };
    return await this.notificationsService.getStudentFeed(profile);
  }
}