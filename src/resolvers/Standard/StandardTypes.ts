import { InputType, Field } from 'type-graphql';

@InputType()
export class StandardInputType {
    @Field()
    label?: string;

    @Field()
    value?: string;
}
