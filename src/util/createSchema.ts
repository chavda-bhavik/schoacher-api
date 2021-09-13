import { buildSchema } from 'type-graphql';
import { UserResolver } from '../resolvers/User/User.resolver';

export const createSchema = async () => {
    return buildSchema({
        resolvers: [UserResolver],
        validate: false,
        dateScalarMode: 'isoDate',
    });
};
