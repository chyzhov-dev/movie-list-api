import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
