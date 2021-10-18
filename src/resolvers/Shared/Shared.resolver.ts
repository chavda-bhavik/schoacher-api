import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Arg, Mutation, Resolver, Ctx } from 'type-graphql';

import { LoginResponse } from '../SharedTypes';
import { MyContext } from '@/global';
import { findEntityOrThrow } from '@/util/typeorm';
import { Employer, Teacher } from '@/entities';
import { LoginResponseTypeEnum, cookieConfig } from '@/constants';

@Resolver()
export class SharedResolver {
    @Mutation(() => LoginResponse)
    async login(@Arg('email') email: string, @Arg('password') password: string, @Ctx() { res }: MyContext): Promise<LoginResponse> {
        let user: Teacher | Employer;
        let userType: LoginResponseTypeEnum;

        user = await findEntityOrThrow(
            Teacher,
            undefined,
            {
                where: { email },
            },
            false,
        );
        userType = LoginResponseTypeEnum.teacher;

        if (!user) {
            user = await findEntityOrThrow(
                Employer,
                undefined,
                {
                    where: { email },
                },
                false,
            );
            userType = LoginResponseTypeEnum.employer;
        }

        if (!user)
            return {
                error: 'User not found!',
            };

        let result = await bcrypt.compare(password, user.password);
        if (!result)
            return {
                error: 'User not found!',
            };

        let token = sign({ id: user.id, type: userType }, process.env.jwt_secret!);
        res.cookie('token', token, cookieConfig);

        return {
            type: userType,
        };
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req }: MyContext): Promise<boolean> {
        await req.cookies.destroy(() => {});
        return true;
    }
}
