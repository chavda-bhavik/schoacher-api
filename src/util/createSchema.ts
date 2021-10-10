import { buildSchema } from 'type-graphql';
import {
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
    ApplicationResolver,
    SharedResolver
} from '../resolvers';

export const createSchema = async () => {
    return buildSchema({
        resolvers: [
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
            ApplicationResolver,
            SharedResolver
        ],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
