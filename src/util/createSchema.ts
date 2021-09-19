import { buildSchema } from 'type-graphql';
import {
    UserResolver,
    TeacherResolver,
    QualificationResolver,
    ExperienceResolver,
    StandardResolver,
    BoardResolver,
    SubjectResolver,
    SubStdBoardResolver,
    MaterialResolver,
    EmployerResolver
} from '../resolvers';

export const createSchema = async () => {
    return buildSchema({
        resolvers: [
            UserResolver,
            TeacherResolver,
            QualificationResolver,
            ExperienceResolver,
            StandardResolver,
            BoardResolver,
            SubjectResolver,
            SubStdBoardResolver,
            MaterialResolver,
            EmployerResolver
        ],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
