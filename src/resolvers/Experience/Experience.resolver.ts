import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Experience, SubStdBoard } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity, saveSubjects } from '@/util/typeorm';
import { ExperienceResponseType, SubStdBoardType } from '../SharedTypes';
import { ExperienceType } from './ExperienceTypes';

@Resolver(Experience)
export class ExperienceResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() experience: Experience) {
        return getData(SubStdBoard, { where: { experience_id: experience.id } });
    }

    @Mutation(() => ExperienceResponseType)
    async addExperience(
        @Arg('teacherId') teacherId: number,
        @Arg('data') data: ExperienceType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<ExperienceResponseType> {
        let experience = await createEntity(Experience, {
            ...data,
            teacher: { id: teacherId },
        });
        if (experience.entity && subjects) {
            await saveSubjects(experience.entity, "experience_id", experience.entity.id, subjects);
        }
        return experience;
    }

    @Query(() => [Experience])
    async getAllExperiences(@Arg('teacherId') teacherId: number): Promise<Experience[] | undefined> {
        let experiences = getData(Experience, { where: { teacher: { id: teacherId } }, order: { start: 'ASC' } });
        return experiences;
    }

    @Mutation(() => ExperienceResponseType)
    async updateExperience(
        @Arg('experienceId') id: number,
        @Arg('data') data: ExperienceType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<ExperienceResponseType> {
        let experience = await updateEntity(Experience, id, data);
        if (experience.entity && subjects) {
            await saveSubjects(experience.entity, "experience_id", experience.entity.id, subjects);
        }
        return experience;
    }

    @Mutation(() => Experience)
    async deleteExperience(@Arg('teacherId') teacherId: number, @Arg('experienceId') experienceId: number): Promise<Experience | undefined> {
        await findEntityOrThrow(Experience, undefined, { where: { id: experienceId, teacher: { id: teacherId } } });
        return removeEntity(Experience, experienceId);
    }

    @Query(() => Experience)
    async getExperience(@Arg('teacherId') teacherId: number, @Arg('experienceId') experienceId: number): Promise<Experience | undefined> {
        let experience = await findEntityOrThrow(Experience, undefined, { where: { id: experienceId, teacher: { id: teacherId } } });
        return experience;
    }
}
