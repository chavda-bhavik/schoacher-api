import { InputType, Field } from 'type-graphql';

@InputType()
export class BoardInputType {
    @Field()
    label?: string;

    @Field()
    value?: string;
}
