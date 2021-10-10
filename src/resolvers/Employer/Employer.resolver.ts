import bcrypt from 'bcryptjs';
import { Arg, Mutation, Query, Resolver, FieldResolver, Root, UseMiddleware, Ctx } from 'type-graphql';

import { Employer, Teacher, SubStdBoard, Address } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, saveSubjects, getData, removeEntity } from '@/util/typeorm';
import { EmployerResponseType, FieldError, SubStdBoardType } from '../SharedTypes';
import { RegisterEmployerType, UpdateEmployerType } from './EmployerTypes';
import { deleteFile, uploadFile } from '@/util/upload';
import constants, { RegularExpresssions } from '@/constants';
import { EmployerAuthMiddleware } from '@/middlewares';
import { EmployerContext } from '@/global';

@Resolver(Employer)
export class EmployerResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() employer: Employer) {
        return getData(SubStdBoard, { where: { employer_id: employer.id } });
    }

    @FieldResolver(() => [Address], { nullable: true })
    address(@Root() employer: Employer) {
        return findEntityOrThrow(Address, undefined, { where: { employer_id: employer.id } }, false);
    }

    @Mutation(() => EmployerResponseType)
    async registerEmployer(@Arg('data') data: RegisterEmployerType): Promise<EmployerResponseType> {
        let error: FieldError | undefined;
        if (!RegularExpresssions.email.test(data.email))
            error = {
                message: 'Email is not valid',
                field: 'email',
            };
        else {
            let teachers = await Teacher.count({ where: { email: data.email } });
            let employers = await Employer.count({ where: { email: data.email } });
            if (teachers > 0 || employers > 0)
                error = {
                    message: 'Email is already registered',
                    field: 'email',
                };
        }
        if (error) return { errors: [error] };
        // save teacher
        data.password = bcrypt.hashSync(data.password);
        let employer = createEntity(Employer, data);
        return employer;
    }

    @Query(() => Employer)
    @UseMiddleware(EmployerAuthMiddleware)
    async employer(
        @Ctx() { user }: EmployerContext
    ): Promise<Employer | undefined> {
        let employer = await findEntityOrThrow(Employer, user.id);
        return employer;
    }

    @Mutation(() => EmployerResponseType)
    @UseMiddleware(EmployerAuthMiddleware)
    async updateEmployerInfo(
        @Ctx() { user }: EmployerContext,
        @Arg('data') data: UpdateEmployerType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<EmployerResponseType> {
        let oldEmployer = await findEntityOrThrow(Employer, user.id);
        // uploading photo if available
        let employerData: Partial<Employer> = data;
        let address = null;
        if (data.address) {
            await removeEntity(Address, oldEmployer.address_id, undefined, true, false);
            address = await createEntity(Address, {
                ...data.address,
                employer_id: user.id,
            });
            delete employerData.address;
            if (address.entity) {
                employerData.address_id = address.entity.id;
            }
        }
        if (typeof data.photo !== 'undefined') {
            if (data.photo) {
                employerData.photoUrl = await uploadFile(data.photo);
                if (oldEmployer.photoUrl !== constants.employerDefaultPhotoUrl) await deleteFile(oldEmployer.photoUrl);
            } else employerData.photoUrl = constants.employerDefaultPhotoUrl;
        }
        // saving/updating entity
        let employer = await updateEntity(Employer, user.id, employerData);
        // adding subjects to employer if available
        if (employer.entity && subjects) {
            await saveSubjects(employer.entity, 'employer_id', employer.entity.id, subjects);
        }
        return employer;
    }
}
