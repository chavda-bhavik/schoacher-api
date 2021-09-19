import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterEmployerType {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;
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

    @Field(() => GraphQLUpload, { nullable: true })
    photo?: FileUpload;
}
