import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserVariableGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private usersService: UsersService,
    ) {}

    public async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const { refresh_token_user } = request.cookies;

        if (!refresh_token_user) {
            request.user = null
            return true;
        }

        let userData: {firstName: string, email: string, id: number} | null = null

        try {
            await this.jwtService
                .verifyAsync(refresh_token_user, {
                    secret: process.env.USER_REFRESH_TOKEN_SECRET,
                })
                .then((decoded) => {
                    userData = decoded
                });
        } catch (error) {
            request.user = null
            return true;
        }

        if (!userData){
            request.user = null
            return true;
        }

        const user = await this.usersService.customFindOne({email: userData.email} )

        if (!user) {
            request.user = null
            return true;
        }

        request.user = user
        return true;
    }
}
