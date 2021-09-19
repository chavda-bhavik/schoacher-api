import bcrypt from 'bcryptjs';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Employer, Teacher } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity } from '@/util/typeorm';
import { FieldError, TeacherResponseType } from '../SharedTypes';
import { RegisterTeacherType, UpdateTeacherType } from './TeacherTypes';
import { uploadFile } from '@/util/upload';
import { RegularExpresssions } from '@/constants';

@Resolver(Teacher)
export class TeacherResolver {
    @Mutation(() => TeacherResponseType)
    async registerTeacher(@Arg('data') data: RegisterTeacherType): Promise<TeacherResponseType> {
        let error: FieldError | undefined;
        if (!RegularExpresssions.email.test(data.email))
            error = {
                message: "Email is not valid",
                field: "email"
            }
        else {
            let teachers = await Teacher.count({ where: { email: data.email } });
            let employers = await Employer.count({ where: { email: data.email } });
            if (teachers > 0 || employers > 0)
                error = {
                    message: "Email is already registered",
                    field: "email"
                }
        }
        if (error) return { errors: [error] }
        // save teacher
        data.password = bcrypt.hashSync(data.password);
        let teacher = createEntity(Teacher, data);
        return teacher;
    }

    @Query(() => Teacher)
    async teacher(@Arg('id') id: number): Promise<Teacher | undefined> {
        let teacher = await findEntityOrThrow(Teacher, id);
        return teacher;
    }

    @Mutation(() => TeacherResponseType)
    async updateTeacherInfo(@Arg('id') id: number, @Arg('data') data: UpdateTeacherType): Promise<TeacherResponseType> {
        let photoUrl = null
        if (data.photo) {
            photoUrl = await uploadFile(data.photo)
        }
        let teacherData: Partial<Teacher> = data;
        if (photoUrl) teacherData.photoUrl = photoUrl;
        return updateEntity(Teacher, id, teacherData);
    }
}
