import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { createConnection, getConnectionOptions } from 'typeorm';
import { createSchema } from './util/createSchema';
import { __prod__ } from './constants';
import { graphqlUploadExpress } from 'graphql-upload';
import dotenv from 'dotenv';
import session from 'express-session';
let FileStore = require('session-file-store')(session);

const main = async () => {
    dotenv.config();
    const PORT = process.env.PORT || 4000;
    const options = await getConnectionOptions(process.env.NODE_ENV || 'development');

    await createConnection({ ...options, name: 'default' });
    const app = express();

    app.set('trust proxy', 1);
    app.use(
        cors({
            origin: [process.env.client_url!, 'https://studio.apollographql.com'],
            credentials: true,
        }),
    );
    app.use(
        session({
            name: 'qid',
            store: new FileStore(),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'none', // csrf
                secure: true, // cookie only works in https
            },
            saveUninitialized: false,
            resave: false,
            secret: process.env.secret!,
        }),
    );

    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });
    await apolloServer.start();
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    apolloServer.applyMiddleware({
        app,
        cors: false,
        bodyParserConfig: {
            limit: '10mb',
        },
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((err) => {
    console.log(err);
});
