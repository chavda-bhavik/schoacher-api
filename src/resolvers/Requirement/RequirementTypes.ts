import { InputType, Field, registerEnumType } from 'type-graphql';
import { RequirementTypeEnum } from '@/constants';

registerEnumType(RequirementTypeEnum, {
    name: 'RequirementTypeEnum',
    description: 'Enum describing Requirement Type',
});

@InputType()
export class RequirementType {
    @Field({ nullable: true })
    title?: string;

    @Field(() => RequirementTypeEnum, { nullable: true })
    type?: RequirementTypeEnum;

    @Field({ nullable: true })
    qualification?: string;

    @Field({ nullable: true })
    startTime?: string;

    @Field({ nullable: true })
    endTime?: string;

    @Field(() => Number, { nullable: true })
    salaryFrom?: number;

    @Field(() => Number, { nullable: true })
    salaryUpTo?: number;

    @Field({ nullable: true })
    description?: string;
}
