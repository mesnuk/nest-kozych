import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthControllerAdmin } from "./auth.controller-admin";
import { AuthControllerUser } from "./auth.controller-user";
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from "../admins/admins.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entities/sesion.entity";
import {UsersModule} from "../users/users.module";
import {GoogleStrategy} from './google.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forFeature([
      Session
    ]),
    AdminsModule,
    UsersModule
  ],
  controllers: [
    AuthControllerAdmin,
    AuthControllerUser
  ],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
