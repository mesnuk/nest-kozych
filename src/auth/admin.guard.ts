import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException, NotAcceptableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import {AdminsService} from '../admins/admins.service';
import {Admin} from '../admins/entities/admin.entity';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {ForbiddenException} from '@nestjs/common/exceptions/forbidden.exception';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private adminsService: AdminsService,
    ) {}

    public async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const { refresh_token_admin } = request.cookies;

        if (!refresh_token_admin) {
            throw new UnauthorizedException('Admin not authorized');
        }

        let adminData: {firstName: string, email: string, id: number } | null = null

        try {
            await this.jwtService
                .verifyAsync(refresh_token_admin, {
                    secret: process.env.ADMIN_REFRESH_TOKEN_SECRET
                })
                .then((decoded) => {
                    adminData = decoded
                });
        } catch (error) {
            throw new UnauthorizedException('Admin not authorized')
        }


        if (!adminData){
            throw new UnauthorizedException('Admin not authorized')
        }

        const admin: Admin = await this.adminsService.customFindOne({id: adminData.id})

        if (!admin) {
            throw new UnauthorizedException('Admin not authorized');
        }
        const isRoot = admin.role === AdminRolesEnum.ROOT

        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!isRoot && roles && !roles.includes(admin.role)) {
            throw new ForbiddenException('You don`t have permission')
        }

        request.admin = {
            ...admin,
            _isRoot: isRoot,
        }
        return true;
    }
}
