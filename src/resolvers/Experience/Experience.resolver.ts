import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Experience, SubStdBoard } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity, saveSubjects, deleteSubjects } from '@/util/typeorm';
import { ExperienceResponseType, SubStdBoardType } from '../SharedTypes';
import { ExperienceType } from './ExperienceTypes';
import { TeacherAuthMiddleware } from '@/middlewares';
import { TeacherContext } from '@/global';

@Resolver(Experience)
export class ExperienceResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() experience: Experience) {
        return getData(SubStdBoard, { where: { experience_id: experience.id } });
    }

    @Mutation(() => ExperienceResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async addExperience(
        @Ctx() { user }: TeacherContext,
        @Arg('data') data: ExperienceType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<ExperienceResponseType> {
        if (data.currentlyWorking) data.end = undefined;
        let experience = await createEntity(Experience, {
            ...data,
            teacher: { id: user.id },
        });
        if (experience.entity && subjects) {
            await saveSubjects(experience.entity, 'experience_id', experience.entity.id, subjects);
        } else throw new Error('Subjects are required!');
        return experience;
    }

    @Query(() => [Experience])
    @UseMiddleware(TeacherAuthMiddleware)
    async getAllExperiences(@Ctx() { user }: TeacherContext): Promise<Experience[] | undefined> {
        let experiences = getData(Experience, { where: { teacher: { id: user.id } }, order: { start: 'ASC' } });
        return experiences;
    }

    @Mutation(() => ExperienceResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async updateExperience(
        @Arg('experienceId') id: number,
        @Arg('data') data: ExperienceType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<ExperienceResponseType> {
        if (data.currentlyWorking) data.end = undefined;
        let experience = await updateEntity(Experience, id, data);
        if (experience.entity && subjects) {
            await saveSubjects(experience.entity, 'experience_id', experience.entity.id, subjects);
        }
        return experience;
    }

    @Mutation(() => Experience)
    @UseMiddleware(TeacherAuthMiddleware)
    async deleteExperience(@Arg('experienceId') experienceId: number): Promise<Experience | null> {
        await findEntityOrThrow(Experience, experienceId);
        await deleteSubjects('experience_id', experienceId);
        return removeEntity(Experience, experienceId);
    }

    @Query(() => Experience)
    @UseMiddleware(TeacherAuthMiddleware)
    async getExperience(@Arg('experienceId') experienceId: number): Promise<Experience | undefined> {
        let experience = await findEntityOrThrow(Experience, experienceId);
        return experience;
    }
}
