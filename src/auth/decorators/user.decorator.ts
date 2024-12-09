import {User} from '../../users/entities/user.entity';
import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export type UserAuthDecType = {
    user: User
}

export type UserVariable = User | null


export const UserDec = createParamDecorator(
    (data: unknown, ctx: ExecutionContext):{ user: User} => {
        const request = ctx.switchToHttp().getRequest();
        return {
            user: request.user,
        };
    },
);