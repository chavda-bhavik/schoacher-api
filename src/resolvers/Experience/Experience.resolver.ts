import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Experience } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity } from '@/util/typeorm';
import { ExperienceResponseType } from '../SharedTypes';
import { ExperienceType } from './ExperienceTypes';

@Resolver()
export class ExperienceResolver {
    @Mutation(() => ExperienceResponseType)
    async addExperience(@Arg('teacherId') teacherId: number, @Arg('data') data: ExperienceType): Promise<ExperienceResponseType> {
        let experience = await createEntity(Experience, {
            ...data,
            teacher: { id: teacherId },
        });
        return experience;
    }

    @Query(() => [Experience])
    async getAllExperiences(@Arg('teacherId') teacherId: number): Promise<Experience[] | undefined> {
        let experiences = getData(Experience, { where: { teacher: { id: teacherId } }, order: { start: 'ASC' } });
        return experiences;
    }

    @Mutation(() => ExperienceResponseType)
    async updateExperience(@Arg('experienceId') id: number, @Arg('data') data: ExperienceType): Promise<ExperienceResponseType> {
        return updateEntity(Experience, id, data);
    }

    @Mutation(() => Experience)
    async deleteExperience(@Arg('teacherId') teacherId: number, @Arg('experienceId') experienceId: number): Promise<Experience | undefined> {
        await findEntityOrThrow(Experience, undefined, { where: { id: experienceId, teacher: { id: teacherId } } });
        return removeEntity(Experience, experienceId);
    }

    @Query(() => Experience)
    async getExperiences(@Arg('teacherId') teacherId: number, @Arg('experienceId') experienceId: number): Promise<Experience | undefined> {
        let experiences = findEntityOrThrow(Experience, undefined, { where: { id: experienceId, teacher: { id: teacherId } } });
        return experiences;
    }
}
