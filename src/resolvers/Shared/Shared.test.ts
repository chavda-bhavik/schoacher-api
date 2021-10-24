import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';

import { createApolloServer, testConn } from '../../util/test-util';

let conn: Connection, mutate: TestQuery;
beforeAll(async () => {
    conn = await testConn();
    const apolloServer = await createApolloServer();
    let client = createTestClient({
        apolloServer,
    });
    mutate = client.mutate;
});
afterAll(async () => {
    await conn.close();
});

const loginTeacherMutation = `
    mutation LoginMutation($password: String!, $email: String!) {
        login(password: $password, email: $email) {
            error
            type
        }
    }
`;
const loginEmployerMutation = `
    mutation LoginMutation($password: String!, $email: String!) {
        login(password: $password, email: $email) {
            error
            type
        }
    }
`;

describe('shared login/logout operations', () => {
    it('should login teacher', async () => {
        let response = await mutate(loginTeacherMutation, {
            variables: {
                password: 'john@123',
                email: 'johndoe@gmail.com',
            },
        });
        expect(response).toMatchObject({
            data: {
                login: {
                    error: null,
                    type: 'teacher',
                },
            },
        });
    });

    it('should login employer', async () => {
        let response = await mutate(loginEmployerMutation, {
            variables: {
                password: 'saraswati@123',
                email: 'contact@saraswati.com',
            },
        });
        expect(response).toMatchObject({
            data: {
                login: {
                    error: null,
                    type: 'employer',
                },
            },
        });
    });
});
