import { Arg, Query, Resolver, Mutation, FieldResolver, Root, UseMiddleware, Ctx } from 'type-graphql';

import { Application, Teacher, Requirement, Employer } from '@/entities';
import { findEntityOrThrow, removeEntity, createEntity } from '@/util/typeorm';
import { getConnection } from 'typeorm';
import { EmployerAuthMiddleware, TeacherAuthMiddleware } from '@/middlewares';
import { EmployerContext, TeacherContext } from '@/global';

@Resolver(Application)
export class ApplicationResolver {
    @FieldResolver(() => Requirement)
    requirement(@Root() application: Application) {
        return findEntityOrThrow(Requirement, application.requirementId);
    }

    @FieldResolver(() => Teacher)
    teacher(@Root() application: Application) {
        return findEntityOrThrow(Teacher, application.teacherId);
    }

    @Query(() => [Application])
    @UseMiddleware(EmployerAuthMiddleware)
    async applications(
        @Arg('requirementId', { nullable: true }) requirementId: number,
        @Ctx() { user }: EmployerContext,
    ): Promise<Application[]> {
        let query = await getConnection()
            .getRepository(Application)
            .createQueryBuilder('app')
            .innerJoin(Requirement, 'req', 'app.requirementId = req.id')
            .innerJoin(Employer, 'emp', 'req.employerId = emp.id');

        query.where('emp.id = :empId', { empId: user.id });
        if (requirementId) {
            query.andWhere('req.id = :reqId', { reqId: requirementId });
        }
        return query.getMany();
    }

    @Mutation(() => Boolean)
    @UseMiddleware(TeacherAuthMiddleware)
    async toggleApplication(
        @Ctx() { user }: TeacherContext,
        @Arg('requirementId') requirementId: number
    ): Promise<Boolean> {
        let application = await findEntityOrThrow(Application, undefined, { where: { teacherId: user.id, requirementId } }, false);
        if (application) await removeEntity(Application, application.id);
        else await createEntity(Application, { teacherId: user.id, requirementId });
        return !application;
    }
}
