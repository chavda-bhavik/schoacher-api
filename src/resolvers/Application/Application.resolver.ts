import { Arg, Query, Resolver, Mutation, FieldResolver, Root } from 'type-graphql';

import { Application, Teacher, Requirement, Employer } from '@/entities';
import { findEntityOrThrow, removeEntity, createEntity } from '@/util/typeorm';
import { getConnection } from 'typeorm';

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
    async applications(
        @Arg('requirementId', { nullable: true }) requirementId: number,
        @Arg('employerId') employerId: number,
    ): Promise<Application[]> {
        let query = await getConnection()
            .getRepository(Application)
            .createQueryBuilder('app')
            .innerJoin(Requirement, 'req', 'app.requirementId = req.id')
            .innerJoin(Employer, 'emp', 'req.employerId = emp.id');

        query.where('emp.id = :empId', { empId: employerId });
        if (requirementId) {
            query.andWhere('req.id = :reqId', { reqId: requirementId });
        }
        return query.getMany();
    }

    @Mutation(() => Boolean)
    async toggleApplication(@Arg('teacherId') teacherId: number, @Arg('requirementId') requirementId: number): Promise<Boolean> {
        let application = await findEntityOrThrow(Application, undefined, { where: { teacherId, requirementId } }, false);
        if (application) await removeEntity(Application, application.id);
        else await createEntity(Application, { teacherId, requirementId });
        return !application;
    }
}
