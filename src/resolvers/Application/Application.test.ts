import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';

import { JohnDoeTeacherJWTToken } from '../../util/test-util';
import { createApolloServer, testConn } from '../../util/test-util';

let conn: Connection, mutate: TestQuery;
beforeAll(async () => {
    conn = await testConn();
    const apolloServer = await createApolloServer();
    let client = createTestClient({
        apolloServer,
        extendMockRequest: {
            cookies: {
                token: JohnDoeTeacherJWTToken,
            },
        },
    });
    mutate = client.mutate;
});
afterAll(async () => {
    await conn.close();
});

const toggleApplicationMutation = `
    mutation Mutation($requirementId: Float!) {
        toggleApplication(requirementId: $requirementId)
    }
`;

describe('experience operations', () => {
    it('should apply for application', async () => {
        let response = await mutate(toggleApplicationMutation, {
            variables: {
                requirementId: 1,
            },
        });
        expect(response.data).toMatchObject({
            toggleApplication: true,
        });
        response = await mutate(toggleApplicationMutation, {
            variables: {
                requirementId: 1,
            },
        });
        expect(response.data).toMatchObject({
            toggleApplication: false,
        });
    });
});
