import { buildSchema } from 'type-graphql';
import { UserResolver, TeacherResolver, QualificationResolver } from '../resolvers';

export const createSchema = async () => {
    return buildSchema({
        resolvers: [UserResolver, TeacherResolver, QualificationResolver],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
