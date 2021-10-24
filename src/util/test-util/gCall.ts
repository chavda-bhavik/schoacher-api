import 'reflect-metadata';
import { graphql, GraphQLSchema } from 'graphql';
import { Maybe } from 'type-graphql';

import { createSchema } from '../createSchema';
import { ApolloServer } from 'apollo-server-express';

interface Options {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: Options) => {
    if (!schema) {
        schema = await createSchema();
    }
    return graphql({
        schema: schema,
        source,
        variableValues,
    });
};

export const createApolloServer = async (): Promise<any> => {
    if (!schema) {
        schema = await createSchema();
    }
    let server = new ApolloServer({
        schema,
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    await server.start();
    return server;
};
