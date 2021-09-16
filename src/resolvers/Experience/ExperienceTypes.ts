import { InputType, Field, registerEnumType } from 'type-graphql';
import { ExperienceTypeEnum } from '@/entities/Experience';

registerEnumType(ExperienceTypeEnum, {
    name: 'ExperienceTypeEnum', // this one is mandatory
    description: 'Enum describing Experience Type', // this one is optional
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
    instituteName?: string;

    @Field({ nullable: true })
    currentlyWorking?: boolean;

    @Field({ nullable: true })
    description?: string;

    @Field(() => ExperienceTypeEnum, { nullable: true })
    type?: ExperienceTypeEnum;
}
