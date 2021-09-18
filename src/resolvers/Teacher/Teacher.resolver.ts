import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Teacher } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity } from '@/util/typeorm';
import { TeacherResponseType } from '../SharedTypes';
import { RegisterTeacherType, UpdateTeacherType } from './TeacherTypes';
import { uploadFile } from '@/util/upload';

@Resolver(Teacher)
export class TeacherResolver {
    @Mutation(() => TeacherResponseType)
    async registerTeacher(@Arg('data') data: RegisterTeacherType): Promise<TeacherResponseType> {
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
