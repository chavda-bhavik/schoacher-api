import bcrypt from 'bcryptjs';
import { Arg, Mutation, Query, Resolver, FieldResolver, Root } from 'type-graphql';

import { Employer, Teacher, SubStdBoard, Address } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, saveSubjects, getData, removeEntity } from '@/util/typeorm';
import { EmployerResponseType, FieldError, SubStdBoardType } from '../SharedTypes';
import { RegisterEmployerType, UpdateEmployerType } from './EmployerTypes';
import { uploadFile } from '@/util/upload';
import { RegularExpresssions } from '@/constants';

@Resolver(Employer)
export class EmployerResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() employer: Employer) {
        return getData(SubStdBoard, { where: { employer_id: employer.id } });
    }

    @FieldResolver(() => [Address])
    address(@Root() employer: Employer) {
        return findEntityOrThrow(Address, undefined, { where: { employer_id: employer.id } });
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
    async employer(@Arg('employerId') id: number): Promise<Employer | undefined> {
        let employer = await findEntityOrThrow(Employer, id);
        return employer;
    }

    @Mutation(() => EmployerResponseType)
    async updateEmployerInfo(
        @Arg('employerId') id: number,
        @Arg('data') data: UpdateEmployerType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<EmployerResponseType> {
        // uploading photo if available
        let photoUrl = null;
        if (data.photo) {
            photoUrl = await uploadFile(data.photo);
        }
        let employerData: Partial<Employer> = data;
        let address = null;
        if (data.address) {
            await removeEntity(Address, undefined, { where: { employer_id: id } });
            address = await createEntity(Address, {
                ...data.address,
                employer_id: id,
            });
            delete employerData.address;
            if (address.entity) {
                employerData.address_id = address.entity.id;
            }
        }
        if (photoUrl) employerData.photoUrl = photoUrl;
        // saving/updating entity
        let employer = await updateEntity(Employer, id, employerData);
        // adding subjects to employer if available
        if (employer.entity && subjects) {
            await saveSubjects(employer.entity, 'employer_id', employer.entity.id, subjects);
        }
        return employer;
    }
}
