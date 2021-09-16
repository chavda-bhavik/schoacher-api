import { Qualification, Teacher, User, Experience } from '@/entities';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
export class ResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    entity?: User;
}

@ObjectType()
export class TeacherResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Teacher, { nullable: true })
    entity?: Teacher;
}

@ObjectType()
export class QualificationResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Qualification, { nullable: true })
    entity?: Qualification;
}

@ObjectType()
export class ExperienceResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Experience, { nullable: true })
    entity?: Experience;
}
