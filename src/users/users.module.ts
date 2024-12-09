import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersAdminController} from './users-admin.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import {AdminsModule} from '../admins/admins.module';
import {UsersUserController} from './users-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
    AdminsModule
  ],
  controllers: [UsersAdminController, UsersUserController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
