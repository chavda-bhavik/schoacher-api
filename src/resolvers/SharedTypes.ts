import { Qualification, Teacher, User, Experience, Subject, Board, Standard, Material } from '@/entities';
import { Field, InputType, ObjectType } from 'type-graphql';

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

@InputType()
export class SubStdBoardType {
    @Field()
    boardId: number;
    @Field()
    subjectId: number;
    @Field()
    standardId: number;
}

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

@ObjectType()
export class SubjectResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Subject, { nullable: true })
    entity?: Subject;
}

@ObjectType()
export class BoardResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Board, { nullable: true })
    entity?: Board;
}

@ObjectType()
export class StandardResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Standard, { nullable: true })
    entity?: Standard;
}

@ObjectType()
export class MaterialResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Material, { nullable: true })
    entity?: Material;
}