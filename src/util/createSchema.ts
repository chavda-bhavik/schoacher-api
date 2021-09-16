import { buildSchema } from 'type-graphql';
import { UserResolver, TeacherResolver, QualificationResolver, ExperienceResolver } from '../resolvers';

export const createSchema = async () => {
    return buildSchema({
        resolvers: [UserResolver, TeacherResolver, QualificationResolver, ExperienceResolver],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
