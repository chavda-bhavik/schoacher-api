import { InputType, Field } from 'type-graphql';

@InputType()
export class SubjectInputType {
    @Field()
    label?: string;

    @Field()
    value?: string;
}
