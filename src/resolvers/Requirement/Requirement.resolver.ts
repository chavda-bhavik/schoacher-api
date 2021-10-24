import { getConnection } from 'typeorm';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Employer, Requirement, SubStdBoard, Address, Application } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity, saveSubjects } from '@/util/typeorm';
import { RequirementResponseType, SubStdBoardType } from '../SharedTypes';
import { RequirementType } from './RequirementTypes';
import { RequirementTypeEnum } from '@/constants';
import { EmployerAuthMiddleware, TeacherAuthMiddleware } from '@/middlewares';
import { EmployerContext, TeacherContext } from '@/global';

@Resolver(Requirement)
export class RequirementResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() requirement: Requirement) {
        return getData(SubStdBoard, { where: { requirement_id: requirement.id } });
    }

    @FieldResolver(() => Employer)
    employer(@Root() requirement: Requirement) {
        return findEntityOrThrow(Employer, requirement.employerId);
    }

    @FieldResolver(() => Boolean)
    @UseMiddleware(TeacherAuthMiddleware)
    async applied(@Root() requirement: Requirement, @Ctx() { user }: TeacherContext) {
        let applications = await Application.count({ where: { teacherId: user.id, requirementId: requirement.id } });
        return applications > 0;
    }

    @Query(() => [Requirement])
    @UseMiddleware(TeacherAuthMiddleware)
    async search(
        @Arg('city', { nullable: true }) city: string,
        @Arg('state', { nullable: true }) state: string,
        @Arg('pincode', { nullable: true }) pincode: number,
        @Arg('expectedSalary', { nullable: true }) expectedSalary: number,
        @Arg('type', () => RequirementTypeEnum, { nullable: true }) type: RequirementTypeEnum,
    ): Promise<Requirement[]> {
        let query = await getConnection()
            .getRepository(Requirement)
            .createQueryBuilder('req')
            .innerJoin(Employer, 'emp', 'req.employerId = emp.id')
            .innerJoin(Address, 'a', 'emp.address_id = a.id');

        let addedWhere = false;
        if (city) {
            query.where('a.city LIKE :city', { city: `%${city}%` });
            addedWhere = true;
        }
        if (state) {
            if (addedWhere) query.andWhere('a.state LIKE :state', { state: `%${state}%` });
            else {
                query.where('a.state LIKE :state', { state: `%${state}%` });
                addedWhere = true;
            }
        }
        if (pincode) {
            if (addedWhere) query.andWhere('a.pincode LIKE :pincode', { pincode: `%${pincode}` });
            else {
                query.where('a.pincode LIKE :pincode', { pincode: `%${pincode}` });
                addedWhere = true;
            }
        }
        if (expectedSalary) {
            if (addedWhere) query.andWhere(':sal between req.salaryFrom and req.salaryUpTo', { sal: expectedSalary });
            else {
                query.where(':sal between req.salaryFrom and req.salaryUpTo', { sal: expectedSalary });
                addedWhere = true;
            }
        }
        if (type) {
            if (addedWhere) query.andWhere('req.type = :type', { type });
            else {
                query.where('req.type = :type', { type });
                addedWhere = true;
            }
        }
        return query.getMany();
    }

    @Mutation(() => RequirementResponseType)
    @UseMiddleware(EmployerAuthMiddleware)
    async addRequirement(
        @Ctx() { user }: EmployerContext,
        @Arg('data') data: RequirementType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<RequirementResponseType> {
        let requirement = await createEntity(Requirement, {
            ...data,
            employer: { id: user.id },
        });
        if (requirement.entity && subjects) {
            await saveSubjects(requirement.entity, 'requirement_id', requirement.entity.id, subjects);
        } else throw new Error('Subjects are required!');
        return requirement;
    }

    @Query(() => [Requirement])
    @UseMiddleware(EmployerAuthMiddleware)
    async getAllRequirements(@Ctx() { user }: EmployerContext): Promise<Requirement[] | undefined> {
        let requirements = getData(Requirement, { where: { employer: { id: user.id } } });
        return requirements;
    }

    @Mutation(() => RequirementResponseType)
    @UseMiddleware(EmployerAuthMiddleware)
    async updateRequirement(
        @Arg('requirementId') id: number,
        @Arg('data') data: RequirementType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<RequirementResponseType> {
        let requirement = await updateEntity(Requirement, id, data);
        if (requirement.entity && subjects) {
            await saveSubjects(requirement.entity, 'requirement_id', requirement.entity.id, subjects);
        }
        return requirement;
    }

    @Mutation(() => Requirement)
    @UseMiddleware(EmployerAuthMiddleware)
    async deleteRequirement(@Arg('requirementId') requirementId: number): Promise<Requirement | null> {
        await findEntityOrThrow(Requirement, requirementId);
        await removeEntity(SubStdBoard, undefined, { where: { requirement_id: requirementId } });
        return removeEntity(Requirement, requirementId);
    }

    @Query(() => Requirement)
    async getRequirement(@Arg('requirementId') requirementId: number): Promise<Requirement | undefined> {
        let requirement = await findEntityOrThrow(Requirement, requirementId);
        return requirement;
    }
}
