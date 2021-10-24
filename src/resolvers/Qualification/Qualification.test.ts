import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';
import faker from 'faker';

import { Qualification } from '../../entities';
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

const addQualificationMutation = `
    mutation AddQualificationMutation($data: QualificationType!) {
        addQualification(data: $data) {
            errors {
                field
                message
            }
            entity {
                grade
            }
        }
    }
`;
const updateQualificationMutation = `
    mutation UpdateQualificationMutation($data: QualificationType!, $qualificationId: Float!) {
        updateQualification(data: $data, qualificationId: $qualificationId) {
            errors {
                field
                message
            }
            entity {
                start
                end
                college
                degree
            }
        }
    }
`;
const getAllQualificationsQuery = `
    query Query {
        getAllQualifications {
            id
            start
            end
            college
            degree
        }
    }
`;
const getQualificationQuery = `
    query Query($qualificationId: Float!) {
        getQualification(qualificationId: $qualificationId) {
            id
            start
            college
            end
            degree
            grade
        }
    }
`;
const deleteQualificationMutation = `
    mutation DeleteQualificationMutation($qualificationId: Float!) {
        deleteQualification(qualificationId: $qualificationId) {
            id
        }
    }
`;

describe('qualification operations', () => {
    const addQualificationData: Partial<Qualification> = {
        start: faker.date.past(3).toISOString(),
        end: faker.date.past(2).toISOString(),
        college: faker.company.companyName(),
        degree: faker.lorem.words(),
        grade: 'A+',
        description: faker.name.jobDescriptor(),
    };
    let updateData = {
        college: 'xyz college',
        degree: 'adsf addsf',
        start: '2017-09-18',
        end: '2019-09-18',
    };

    it('should add qualification', async () => {
        let response = await mutate(addQualificationMutation, {
            variables: {
                data: addQualificationData,
            },
        });
        expect(response).toMatchObject({
            data: {
                addQualification: {
                    entity: {
                        grade: addQualificationData.grade,
                    },
                },
            },
        });
    });

    it('should update qualification', async () => {
        let qualificationId = 1;
        let response = await mutate(updateQualificationMutation, {
            variables: {
                data: updateData,
                qualificationId,
            },
        });
        expect(response).toMatchObject({
            data: {
                updateQualification: {
                    entity: {
                        start: updateData.start,
                        end: updateData.end,
                        degree: updateData.degree,
                    },
                },
            },
        });
    });

    it('should get all qualifications', async () => {
        let response = await query(getAllQualificationsQuery);
        // @ts-ignore
        expect(response.data.getAllQualifications.length).toBeGreaterThan(1);
    });

    it('should get single qualification', async () => {
        let response = await query(getQualificationQuery, {
            variables: {
                qualificationId: 1,
            },
        });
        expect(response.data).toMatchObject({
            getQualification: {
                id: 1,
                start: updateData.start,
                end: updateData.end,
                degree: updateData.degree,
            },
        });
    });

    it('should throw error for updating empty data', async () => {
        let response = await query(updateQualificationMutation, {
            variables: {
                qualificationId: 1,
                data: {
                    degree: '',
                    college: '',
                    start: '',
                    end: '',
                },
            },
        });
        // @ts-ignore
        expect(response.data.updateQualification.errors.length).toBe(4);
    });

    it('should delete qualification', async () => {
        await mutate(deleteQualificationMutation, {
            variables: {
                qualificationId: 2,
            },
        });
        let response = await query(getQualificationQuery, {
            variables: {
                qualificationId: 2,
            },
        });
        expect(response.data).toBeNull();
        expect(response.errors!.length).toBeGreaterThan(0);
    });
});
