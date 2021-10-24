import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';
import faker from 'faker';

import { Employer, SubStdBoard } from '../../entities';
import { XYZEmployerJWTToken } from '../../util/test-util';
import { createApolloServer, testConn } from '../../util/test-util';
import constants, { EmployerTypeEnum } from '../../constants';

let conn: Connection, mutate: TestQuery, query: TestQuery;
beforeAll(async () => {
    conn = await testConn();
    const apolloServer = await createApolloServer();
    let client = createTestClient({
        apolloServer,
        extendMockRequest: {
            cookies: {
                token: XYZEmployerJWTToken,
            },
        },
    });
    mutate = client.mutate;
    query = client.query;
});
afterAll(async () => {
    await conn.close();
});

const registerEmployerMutation = `
    mutation RegisterEmployerMutation($data: RegisterEmployerType!) {
        registerEmployer(data: $data) {
            errors {
                field
                message
            }
            entity {
                id
                name
                email
            }
        }
    }
`;
const updateEmployerMutation = `
    mutation UpdateEmployerInfoMutation($data: UpdateEmployerType!, $subjects: [SubStdBoardType!]) {
        updateEmployerInfo(data: $data, subjects: $subjects) {
            errors {
                field
                message
            }
            entity {
                id
                name
                type
                mobile1
                mobile2
                email
                about
                address {
                    id
                    street1
                    street2
                    state
                    city
                    pincode
                }
                subjects {
                    id
                }
            }
        }
    }
`;
const getEmployerQuery = `
    query Query {
        employer {
            id
            name
            type
            mobile1
            mobile2
            email
            about
            photoUrl
            address {
               id
            }
            subjects {
                id
            }
        }
    }
`;

describe('employer operations', () => {
    const employerRegistrationData: Partial<Employer> = {
        name: faker.animal.bird(),
        email: faker.internet.email(),
        type: EmployerTypeEnum.School,
        password: faker.internet.password(),
    };
    const updateEmployerData: Partial<Employer> = {
        mobile1: '9898989898',
        mobile2: '8898989898',
        about: 'asdfasfasfdasfasfass asdfasdfasfd asdf',
        address: {
            street1: 'asdfasfasf',
            street2: 'asfdasf adsfasfas',
            city: 'asddf',
            state: 'asfdassdfasdf',
            pincode: 395008,
        },
    };
    const updateEmployerSubStdBoards: Partial<SubStdBoard>[] = [
        {
            boardId: 1,
            standardId: 1,
            subjectId: 1,
        },
        {
            boardId: 1,
            standardId: 2,
            subjectId: 2,
        },
    ];
    it('should register employer', async () => {
        let response = await mutate(registerEmployerMutation, {
            variables: {
                data: employerRegistrationData,
            },
        });
        expect(response.data).toMatchObject({
            registerEmployer: {
                entity: {
                    name: employerRegistrationData.name,
                    email: employerRegistrationData.email,
                },
            },
        });
    });

    it('should update employer', async () => {
        let response = await mutate(updateEmployerMutation, {
            variables: {
                data: updateEmployerData,
                subjects: updateEmployerSubStdBoards,
                address: updateEmployerData.address,
            },
        });
        expect(response.data).toMatchObject({
            updateEmployerInfo: {
                entity: {
                    about: updateEmployerData.about,
                    mobile1: updateEmployerData.mobile1,
                    mobile2: updateEmployerData.mobile2,
                    address: updateEmployerData.address,
                },
            },
        });
        // @ts-ignore
        expect(response.data.updateEmployerInfo.entity.subjects.length).toBe(2);
    });

    it('should get employer info', async () => {
        let response = await query(getEmployerQuery);
        // @ts-ignore
        expect(response.data).toMatchObject({
            employer: {
                name: 'XYZ School',
                type: 'School',
                mobile1: updateEmployerData.mobile1,
                mobile2: updateEmployerData.mobile2,
                email: 'xyz@gmail.com',
                about: updateEmployerData.about,
                photoUrl: constants.employerDefaultPhotoUrl,
            },
        });
        // @ts-ignore
        expect(response.data.employer.subjects.length).toBe(2);
    });
});
