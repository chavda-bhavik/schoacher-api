import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Qualification } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity } from '@/util/typeorm';
import { QualificationResponseType } from '../SharedTypes';
import { QualificationType } from './QualificationTypes';

@Resolver(Qualification)
export class QualificationResolver {
    @Mutation(() => QualificationResponseType)
    async addQualification(@Arg('teacherId') teacherId: number, @Arg('data') data: QualificationType): Promise<QualificationResponseType> {
        let qualification = await createEntity(Qualification, {
            ...data,
            teacher: { id: teacherId },
        });
        return qualification;
    }

    @Query(() => [Qualification])
    async getAllQualifications(@Arg('teacherId') teacherId: number): Promise<Qualification[] | undefined> {
        let qualifications = getData(Qualification, { where: { teacher: { id: teacherId } }, order: { start: 'ASC' } });
        return qualifications;
    }

    @Mutation(() => QualificationResponseType)
    async updateQualification(@Arg('qualificationId') id: number, @Arg('data') data: QualificationType): Promise<QualificationResponseType> {
        return updateEntity(Qualification, id, data);
    }

    @Mutation(() => Qualification)
    async deleteQualification(
        @Arg('teacherId') teacherId: number,
        @Arg('qualificationId') qualificationId: number,
    ): Promise<Qualification | undefined> {
        await findEntityOrThrow(Qualification, undefined, { where: { id: qualificationId, teacher: { id: teacherId } } });
        return removeEntity(Qualification, qualificationId);
    }

    @Query(() => Qualification)
    async getQualifications(
        @Arg('teacherId') teacherId: number,
        @Arg('qualificationId') qualificationId: number,
    ): Promise<Qualification | undefined> {
        let qualifications = findEntityOrThrow(Qualification, undefined, { where: { id: qualificationId, teacher: { id: teacherId } } });
        return qualifications;
    }
}
