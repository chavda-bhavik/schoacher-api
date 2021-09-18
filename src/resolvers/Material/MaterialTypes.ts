import { InputType, Field } from 'type-graphql';

@InputType()
export class MaterialType {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;
}
