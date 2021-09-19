import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { InputType, Field } from 'type-graphql';

@InputType()
export class RegisterTeacherType {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class UpdateTeacherType {
    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    mobile1?: string;

    @Field({ nullable: true })
    mobile2?: string;

    @Field({ nullable: true })
    headline?: string;

    @Field({ nullable: true })
    address?: string;

    @Field({ nullable: true })
    gender?: number;

    @Field(() => GraphQLUpload, { nullable: true })
    photo?: FileUpload;
}
