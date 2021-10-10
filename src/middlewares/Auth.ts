import { verify } from "jsonwebtoken";
import { MiddlewareFn, NextFn } from "type-graphql";

import { Employer, Teacher } from "@/entities";
import { EmployerContext, TeacherContext, TokenDecoded } from "@/global";
import { findEntityOrThrow } from "@/util/typeorm";

export const TeacherAuthMiddleware: MiddlewareFn<TeacherContext> = async ({ context }, next: NextFn) => {
    try {
        let user: Teacher;
        if (context.req.session.token) {
            // @ts-ignore
            var decoded: TokenDecoded = verify(context.req.session.token, process.env.jwt_secret!);
            user = await findEntityOrThrow(Teacher, decoded.id);
            if (!user)
                throw new Error("You're Unauthorized!");
            else {
                context.user = user;
                return next();
            }
        } else
            throw new Error("You're Unauthorized!");
    } catch (err) {
        throw new Error("You're Unauthorized!");
    }
};

export const EmployerAuthMiddleware: MiddlewareFn<EmployerContext> = async ({ context }, next: NextFn) => {
    try {
        let user: Employer;
        if (context.req.session.token) {
            // @ts-ignore
            var decoded: TokenDecoded = verify(context.req.session.token, process.env.jwt_secret!);
            user = await findEntityOrThrow(Employer, decoded.id);
            if (!user)
                throw new Error("You're Unauthorized!");
            else {
                context.user = user;
                return next();
            }
        } else
            throw new Error("You're Unauthorized!");
    } catch (err) {
        throw new Error("You're Unauthorized!");
    }
};