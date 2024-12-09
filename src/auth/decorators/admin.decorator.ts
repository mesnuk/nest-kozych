
import {createParamDecorator, ExecutionContext, SetMetadata} from '@nestjs/common';
import {Admin} from '../../admins/entities/admin.entity';
import {AdminRolesEnum} from '../../admins/types/admin.types';

export type AdminAuthDecType = {admin: Admin}

export const AdminDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext):{ admin: Admin} => {
        const request = ctx.switchToHttp().getRequest();
        return {
            admin: request.admin,
        };
    },
);

export const AdminRoles = (roles: AdminRolesEnum[]) => SetMetadata('roles', roles);