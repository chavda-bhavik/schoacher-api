import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { createConnection, getConnectionOptions } from 'typeorm';
import { createSchema } from './util/createSchema';
import { __prod__ } from './constants';
// import { graphqlUploadExpress } from "graphql-upload";

const main = async () => {
    const PORT = process.env.PORT || 4000;
    const options = await getConnectionOptions(process.env.NODE_ENV || 'development');

    await createConnection({ ...options, name: 'default' });
    const app = express();
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }),
    );
    // app.use("/", express.static(__dirname+'/../build'));

    const apolloServer = new ApolloServer({
        schema: await createSchema(),
        context: ({ req, res }) => ({
            req,
            res,
        }),
        // uploads: false
    });
    await apolloServer.start();
    // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main().catch((err) => {
    console.log(err);
});
