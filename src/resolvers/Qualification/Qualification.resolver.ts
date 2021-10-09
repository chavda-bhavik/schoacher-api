import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Qualification } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity } from '@/util/typeorm';
import { QualificationResponseType } from '../SharedTypes';
import { QualificationType } from './QualificationTypes';
import { TeacherAuthMiddleware } from '@/middlewares';
import { TeacherContext } from '@/global';

@Resolver(Qualification)
export class QualificationResolver {
    @Mutation(() => QualificationResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async addQualification(
        @Ctx() { user }: TeacherContext,
        @Arg('data') data: QualificationType
    ): Promise<QualificationResponseType> {
        let qualification = await createEntity(Qualification, {
            ...data,
            teacher: { id: user.id },
        });
        return qualification;
    }

    @Query(() => [Qualification])
    @UseMiddleware(TeacherAuthMiddleware)
    async getAllQualifications(
        @Ctx() { user }: TeacherContext
    ): Promise<Qualification[] | undefined> {
        let qualifications = getData(Qualification, { where: { teacher: { id: user.id } }, order: { start: 'ASC' } });
        return qualifications;
    }

    @Mutation(() => QualificationResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async updateQualification(
        @Arg('qualificationId') id: number,
        @Arg('data') data: QualificationType
    ): Promise<QualificationResponseType> {
        return updateEntity(Qualification, id, data);
    }

    @Mutation(() => Qualification)
    @UseMiddleware(TeacherAuthMiddleware)
    async deleteQualification(
        @Arg('qualificationId') qualificationId: number
    ): Promise<Qualification | null> {
        await findEntityOrThrow(Qualification, qualificationId);
        return removeEntity(Qualification, qualificationId);
    }

    @Query(() => Qualification)
    @UseMiddleware(TeacherAuthMiddleware)
    async getQualification(
        @Arg('qualificationId') qualificationId: number,
    ): Promise<Qualification | undefined> {
        let qualifications = findEntityOrThrow(Qualification, qualificationId);
        return qualifications;
    }
}
