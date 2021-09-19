import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { InputType, Field, registerEnumType } from 'type-graphql';
import { EmployerTypeEnum } from '@/constants';

registerEnumType(EmployerTypeEnum, {
    name: 'EmployerTypeEnum',
    description: 'Enum describing Employer Type'
});

@InputType()
export class RegisterEmployerType {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(() => EmployerTypeEnum, { nullable: true })
    type?: EmployerTypeEnum;
}

@InputType()
export class UpdateEmployerType {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    mobile1?: string;

    @Field({ nullable: true })
    mobile2?: string;

    @Field({ nullable: true })
    about: string;

    @Field(() => EmployerTypeEnum, { nullable: true })
    type?: EmployerTypeEnum;

    @Field(() => GraphQLUpload, { nullable: true })
    photo?: FileUpload;
}
