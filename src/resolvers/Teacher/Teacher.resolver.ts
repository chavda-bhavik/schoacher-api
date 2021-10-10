import bcrypt from 'bcryptjs';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';

import { Employer, Experience, Material, Qualification, Teacher } from '@/entities';
import { createEntity, findEntityOrThrow, getData, updateEntity } from '@/util/typeorm';
import { FieldError, TeacherResponseType } from '../SharedTypes';
import { RegisterTeacherType, UpdateTeacherType } from './TeacherTypes';
import { uploadFile, deleteFile } from '@/util/upload';
import constants, { RegularExpresssions } from '@/constants';
import { TeacherAuthMiddleware } from '@/middlewares';
import { TeacherContext } from '@/global';

@Resolver(Teacher)
export class TeacherResolver {
    @FieldResolver(() => [Experience])
    experiences(@Root() teacher: Teacher) {
        return getData(Experience, { where: { teacherId: teacher.id } });
    }

    @FieldResolver(() => [Qualification])
    qualifications(@Root() teacher: Teacher) {
        return getData(Qualification, { where: { teacherId: teacher.id } });
    }

    @FieldResolver(() => [Material])
    materials(@Root() teacher: Teacher) {
        return getData(Material, { where: { teacherId: teacher.id } });
    }

    @Mutation(() => TeacherResponseType)
    async registerTeacher(@Arg('data') data: RegisterTeacherType): Promise<TeacherResponseType> {
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
        let teacher = createEntity(Teacher, data);
        return teacher;
    }

    @Query(() => Teacher)
    @UseMiddleware(TeacherAuthMiddleware)
    teacher(@Ctx() { user }: TeacherContext,): Teacher {
        return user;
    }

    @Query(() => Teacher, { nullable: true })
    teacherInfo(@Arg("teacherId") teacherId: number): Promise<Teacher | undefined> {
        return findEntityOrThrow(Teacher, teacherId);
    }

    @Mutation(() => TeacherResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async updateTeacherInfo(
        @Ctx() { user }: TeacherContext,
        @Arg('data') data: UpdateTeacherType
    ): Promise<TeacherResponseType> {
        let teacher = await findEntityOrThrow(Teacher, user.id);
        let teacherData: Partial<Teacher> = data;
        if (typeof data.photo !== 'undefined') {
            if (data.photo) {
                // uploading photo
                teacherData.photoUrl = await uploadFile(data.photo);
                // deleting old photo if photoUrl is not same as defaultUrl
                if (teacher.photoUrl !== constants.teacherDefaultPhotoUrl) await deleteFile(teacher.photoUrl);
            } else teacherData.photoUrl = constants.teacherDefaultPhotoUrl;
        }
        return updateEntity(Teacher, user.id, teacherData);
    }
}
