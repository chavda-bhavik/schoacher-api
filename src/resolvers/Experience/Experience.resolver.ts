import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Experience, SubStdBoard } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity } from '@/util/typeorm';
import { ExperienceResponseType, SubStdBoardType } from '../SharedTypes';
import { ExperienceType } from './ExperienceTypes';
import { getConnection } from 'typeorm';

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
            experience.entity.subjects = subjects.map((sub) => {
                let newSubStdBoard = new SubStdBoard();
                newSubStdBoard.subject = { id: sub.subjectId };
                newSubStdBoard.standard = { id: sub.standardId };
                newSubStdBoard.board = { id: sub.boardId };
                return newSubStdBoard;
            });
            experience.entity.save();
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
            await getConnection().createQueryBuilder().delete().from(SubStdBoard).where('"experience_id" = :id1', { id1: id }).execute();
            experience.entity.subjects = subjects.map((sub) => {
                let newSubStdBoard = new SubStdBoard();
                newSubStdBoard.subject = { id: sub.subjectId };
                newSubStdBoard.standard = { id: sub.standardId };
                newSubStdBoard.board = { id: sub.boardId };
                return newSubStdBoard;
            });
            experience.entity.save();
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
