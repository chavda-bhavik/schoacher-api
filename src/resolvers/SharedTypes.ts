import { User } from '@/entities/User';
import { Field, ObjectType } from 'type-graphql';

// type EntityInstance = User;
// type EntityConstructor = typeof User;

@ObjectType()
export class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
export class ResponseType {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    entity?: User;
}
