import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Employer, Requirement, SubStdBoard } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity, saveSubjects } from '@/util/typeorm';
import { RequirementResponseType, SubStdBoardType } from '../SharedTypes';
import { RequirementType } from './RequirementTypes';

@Resolver(Requirement)
export class RequirementResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() requirement: Requirement) {
        return getData(SubStdBoard, { where: { requirement_id: requirement.id } });
    }

    @FieldResolver(() => Employer)
    empoyer(@Root() requirement: Requirement) {
        return findEntityOrThrow(Employer, requirement.employerId);
    }

    @Mutation(() => RequirementResponseType)
    async addRequirement(
        @Arg('employerId') employerId: number,
        @Arg('data') data: RequirementType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<RequirementResponseType> {
        let requirement = await createEntity(Requirement, {
            ...data,
            employer: { id: employerId }
        });
        if (requirement.entity && subjects) {
            await saveSubjects(requirement.entity, "requirement_id", requirement.entity.id, subjects);
        }
        return requirement;
    }

    @Query(() => [Requirement])
    async getAllRequirements(@Arg('employerId') employerId: number): Promise<Requirement[] | undefined> {
        let requirements = getData(Requirement, { where: { employer: { id: employerId } } });
        return requirements;
    }

    @Mutation(() => RequirementResponseType)
    async updateRequirement(
        @Arg('requirementId') id: number,
        @Arg('data') data: RequirementType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<RequirementResponseType> {
        let requirement = await updateEntity(Requirement, id, data);
        if (requirement.entity && subjects) {
            await saveSubjects(requirement.entity, "requirement_id", requirement.entity.id, subjects);
        }
        return requirement;
    }

    @Mutation(() => Requirement)
    async deleteRequirement(@Arg('employerId') employerId: number, @Arg('requirementId') requirementId: number): Promise<Requirement | undefined> {
        await findEntityOrThrow(Requirement, undefined, { where: { id: requirementId, employer: { id: employerId } } });
        return removeEntity(Requirement, requirementId);
    }

    @Query(() => Requirement)
    async getRequirement(@Arg('employerId') employerId: number, @Arg('requirementId') requirementId: number): Promise<Requirement | undefined> {
        let requirement = await findEntityOrThrow(Requirement, undefined, { where: { id: requirementId, employer: { id: employerId } } });
        return requirement;
    }
}
