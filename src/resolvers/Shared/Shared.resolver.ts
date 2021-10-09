import bcrypt from 'bcryptjs';
import { sign } from "jsonwebtoken";
import { Arg, Mutation, Resolver, Ctx } from 'type-graphql';

import { LoginResponse } from '../SharedTypes';
import { MyContext } from '@/global';
import { findEntityOrThrow } from '@/util/typeorm';
import { Employer, Teacher } from '@/entities';

@Resolver()
export class SharedResolver {
    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<LoginResponse> {
        let user: Teacher | Employer;
        let userType: 'teacher' | 'employer';

        user = await findEntityOrThrow(Teacher, undefined, {
            where: { email },
        }, false);
        userType = 'teacher';

        if (!user) {
            user = await findEntityOrThrow(Employer, undefined, {
                where: { email }
            }, false);
            userType = 'employer';
        }

        if (!user)
            return {
                error: "User not found!"
            }

        let result = await bcrypt.compare(password, user.password);
        if (!result)
            return {
                error: "User not found!"
            }

        let jwtToken = sign({ id: user.id, type: userType }, process.env.jwt_secret!);
        req.session.token = jwtToken;
        req.session.userType = userType;

        return {
            type: userType
        };
    }
}
