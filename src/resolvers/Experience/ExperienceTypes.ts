import { InputType, Field, registerEnumType } from 'type-graphql';
import { EmployerTypeEnum } from '@/constants';

registerEnumType(EmployerTypeEnum, {
    name: 'EmployerTypeEnum',
    description: 'Enum describing Employer Type',
});

@InputType()
export class ExperienceType {
    @Field({ nullable: true })
    start?: string;

    @Field({ nullable: true })
    end?: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    currentlyWorking?: boolean;

    @Field({ nullable: true })
    description?: string;

    @Field(() => EmployerTypeEnum, { nullable: true })
    type?: EmployerTypeEnum;

    @Field({ nullable: true })
    employerName?: string;
}
