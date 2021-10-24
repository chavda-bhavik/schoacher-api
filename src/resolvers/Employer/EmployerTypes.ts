import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { InputType, Field, registerEnumType } from 'type-graphql';
import { EmployerTypeEnum } from '@/constants';
import { Address } from '@/entities/Address';

registerEnumType(EmployerTypeEnum, {
    name: 'EmployerTypeEnum',
    description: 'Enum describing Employer Type',
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
export class AddressType {
    @Field()
    street1: string;

    @Field()
    street2: string;

    @Field()
    city: string;

    @Field()
    state: string;

    @Field()
    pincode: number;
}

@InputType()
export class UpdateEmployerType {
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

    @Field(() => AddressType, { nullable: true })
    address?: Address;
}
