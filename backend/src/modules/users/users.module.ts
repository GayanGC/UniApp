import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, Student } from './entities';

/**
 * Users Module
 * Handles user management functionality
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Student])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for use in other modules
})
export class UsersModule {}
