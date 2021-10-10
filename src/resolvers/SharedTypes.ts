import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';
import { Qualification, Teacher, Experience, Subject, Board, Standard, Material, Employer, Requirement } from '@/entities';
import { LoginResponseTypeEnum } from '@/constants';

registerEnumType(LoginResponseTypeEnum, {
    name: "LoginResponseTypeEnum"
});

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

@ObjectType()
export class EmployerResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Employer, { nullable: true })
    entity?: Employer;
}

@ObjectType()
export class RequirementResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Requirement, { nullable: true })
    entity?: Requirement;
}

@ObjectType()
export class LoginResponse {
    @Field({ nullable: true })
    error?: string;

    @Field(() => LoginResponseTypeEnum, { nullable: true })
    type?: LoginResponseTypeEnum;
}