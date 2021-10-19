import { createTestClient, TestQuery, TestSetOptions } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';
import faker from 'faker';

import { Teacher } from '../../entities';
import { JohnDoeTeacherJWTToken } from '../../util/test-util';
import { createApolloServer, testConn } from '../../util/test-util';

let conn: Connection, query: TestQuery, mutate: TestQuery, setOptions: TestSetOptions;
beforeAll(async () => {
    conn = await testConn();
    const apolloServer = await createApolloServer();
    let client = createTestClient({
        apolloServer,
    });
    mutate = client.mutate;
    query = client.query;
    setOptions = client.setOptions;
});
afterAll(async () => {
    await conn.close();
});

const registerTeacherMutation = `
    mutation RegisterTeacherMutation($data: RegisterTeacherType!) {
        registerTeacher(data: $data) {
            errors {
                field
                message
            }
            entity {
                id
                email
            }
        }
    }
`;
const loginTeacherMutation = `
    mutation LoginMutation($password: String!, $email: String!) {
        login(password: $password, email: $email) {
            error
            type
        }
    }
`;
const teacherInfoQuery = `
    query Query {
        teacher {
            id
            firstName
            lastName
        }
    }
`;

describe('teacher operations', () => {
    const registerTeacherData: Partial<Teacher> = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    it('should register new teacher', async () => {
        let response = await mutate(registerTeacherMutation, {
            variables: {
                data: registerTeacherData,
            },
        });

        expect(response).toMatchObject({
            data: {
                registerTeacher: {
                    entity: {
                        email: registerTeacherData.email,
                    },
                },
            },
        });
    });

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

    it('should get teacher info', async () => {
        setOptions({
            request: {
                cookies: {
                    token: JohnDoeTeacherJWTToken,
                },
            },
        });
        let response = await query(teacherInfoQuery);
        expect(response).toMatchObject({
            data: {
                teacher: {
                    firstName: 'john',
                    lastName: 'doe',
                },
            },
        });
    });
});
