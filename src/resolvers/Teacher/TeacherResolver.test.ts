import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';
import faker from 'faker';

import { Teacher } from '../../entities';
import { JohnDoeTeacherJWTToken } from '../../util/test-util';
import { createApolloServer, testConn } from '../../util/test-util';

let conn: Connection, mutate: TestQuery, query: TestQuery;
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
    query = client.query;
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
const teacherInfoQuery = `
    query Query {
        teacher {
            id
            firstName
            lastName
        }
    }
`;
const updateTeacherInfoMutation = `
    mutation UpdateTeacherInfoMutation($data: UpdateTeacherType!) {
        updateTeacherInfo(data: $data) {
            errors {
                field
                message
            }
            entity {
                firstName
                lastName
                mobile1
                mobile2
                headline
                address
                gender
                email
                about
                photoUrl
            }
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

    it('should get teacher info', async () => {
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

    it('should update teacher info', async () => {
        let updateData = {
            mobile1: '9999999999',
            mobile2: '9898989898',
            headline: 'engilish teacher',
            address: 'New York',
            about: 'asdfasdf',
        };
        let response = await mutate(updateTeacherInfoMutation, {
            variables: {
                data: updateData,
            },
        });
        expect(response).toMatchObject({
            data: {
                updateTeacherInfo: {
                    errors: null,
                    entity: updateData,
                },
            },
        });
    });

    it('should throw errors for invalid data', async () => {
        let updateData = {
            mobile1: '78451',
            mobile2: 'adfasdfaf',
        };
        let response = await mutate(updateTeacherInfoMutation, {
            variables: {
                data: updateData,
            },
        });
        expect(response).toMatchObject({
            data: {
                updateTeacherInfo: {
                    errors: [
                        {
                            field: 'mobile1',
                        },
                        {
                            field: 'mobile2',
                        },
                    ],
                    entity: null,
                },
            },
        });
    });
});
