import { InputType, Field } from 'type-graphql';

@InputType()
export class QualificationType {
    @Field({ nullable: true })
    start?: string;

    @Field({ nullable: true })
    end?: string;

    @Field({ nullable: true })
    college?: string;

    @Field({ nullable: true })
    degree?: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    grade?: string;
}
