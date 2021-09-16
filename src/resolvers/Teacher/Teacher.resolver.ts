import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Teacher } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity } from '@/util/typeorm';
import { TeacherResponseType } from '../SharedTypes';
import { RegisterTeacherType, UpdateTeacherType } from './TeacherTypes';

@Resolver()
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
        return updateEntity(Teacher, id, data);
    }
}
