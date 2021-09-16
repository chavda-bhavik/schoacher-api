import { buildSchema } from 'type-graphql';
import { UserResolver, TeacherResolver } from '../resolvers';

export const createSchema = async () => {
    return buildSchema({
        resolvers: [UserResolver, TeacherResolver],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
