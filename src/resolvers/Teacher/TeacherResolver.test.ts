import faker from 'faker';
import { Connection } from 'typeorm';
import { Teacher } from '../../entities';
import { testConn, gCall } from '../../util/test-util';

let conn: Connection;
beforeAll(async () => {
    conn = await testConn();
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

describe('teacher operations', () => {
    const registerTeacherData: Partial<Teacher> = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    };

    it('should register new teacher', async () => {
        let response = await gCall({
            source: registerTeacherMutation,
            variableValues: {
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
        let response = await gCall({
            source: loginTeacherMutation,
            variableValues: {
                password: registerTeacherData.password,
                email: registerTeacherData.email,
            },
        });
        console.log(response);
        expect(response).toMatchObject({
            data: {
                login: {
                    error: null,
                    type: 'teacher',
                },
            },
        });
    });
});
