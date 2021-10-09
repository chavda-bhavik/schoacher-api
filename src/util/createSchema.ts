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
    EmployerResolver,
    RequirementResolver,
    SharedResolver
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
            EmployerResolver,
            RequirementResolver,
            SharedResolver
        ],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
