import { InputType, Field } from 'type-graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class AddMaterialType {
    @Field({ nullable: true })
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => GraphQLUpload, { nullable: true })
    document: FileUpload;
}

@InputType()
export class UpdateMaterialType {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => GraphQLUpload, { nullable: true })
    document?: FileUpload;
}
