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
export class UserGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private usersService: UsersService,
    ) {}

    public async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const access_token_user = request.headers?.authorization

        if (!access_token_user) {
            throw new UnauthorizedException()
        }

        let userData: {firstName: string, email: string, id: number} | null = null

        try {
            await this.jwtService
                .verifyAsync(access_token_user, {
                    secret: process.env.USER_ACCESS_TOKEN_SECRET
                })
                .then((decoded) => {
                    userData = decoded
                });
        } catch (error) {
            throw new UnauthorizedException()
        }

        if (!userData){
            throw new UnauthorizedException()
        }

        const user = await this.usersService.customFindOne({email: userData.email} )

        if (!user) {
            throw new UnauthorizedException();
        }

        request.user = user
        return true;
    }
}
