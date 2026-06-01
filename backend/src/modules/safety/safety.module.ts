import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnonymousComplaint } from './entities/anonymous-complaint.entity';
import { SafetyService } from './safety.service';
import { SafetyController } from './safety.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnonymousComplaint]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
          user: process.env.SMTP_USER || 'ethereal.user',
          pass: process.env.SMTP_PASS || 'ethereal.pass',
        },
      },
      defaults: {
        from: '"UniApp Safety Alert" <noreply@uniapp.com>',
      },
    }),
  ],
  controllers: [SafetyController],
  providers: [SafetyService],
})
export class SafetyModule {}
