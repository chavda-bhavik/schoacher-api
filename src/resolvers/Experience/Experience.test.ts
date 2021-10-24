import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';
import faker from 'faker';

import { Experience, SubStdBoard } from '../../entities';
import { JohnDoeTeacherJWTToken } from '../../util/test-util';
import { createApolloServer, testConn } from '../../util/test-util';
import { EmployerTypeEnum } from '../../constants';

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

const addExeperienceMutation = `
    mutation AddExperienceMutation($data: ExperienceType!, $subjects: [SubStdBoardType!]) {
        addExperience(data: $data, subjects: $subjects) {
            errors {
                field
                message
            }
            entity {
                start
                end
                type
                subjects {
                    id
                    standardId
                    boardId
                    subjectId
                }
            }
        }
    }
`;
const updateExperienceMutation = `
    mutation AddExperienceMutation($data: ExperienceType!, $experienceId: Float!, $subjects: [SubStdBoardType!]) {
        updateExperience(data: $data, experienceId: $experienceId, subjects: $subjects) {
            errors {
                field
                message
            }
            entity {
                id
                start
                end
                currentlyWorking
                subjects {
                    id
                    standardId
                    boardId
                    subjectId
                }
            }
        }
    }
`;
const deleteExperienceMutation = `
    mutation DeleteExperienceMutation($experienceId: Float!) {
        deleteExperience(experienceId: $experienceId) {
           id
        }
    }
`;
const getAllExperiencesQuery = `
    query Query {
        getAllExperiences {
            id
            start
            end
            title
            type
            currentlyWorking
            description
            employerName
            subjects {
                id
            }
        }
    }
`;
const getExperienceQuery = `
    query Query($experienceId: Float!) {
        getExperience(experienceId: $experienceId) {
            id
            start
            end
            title
            type
            currentlyWorking
            description
            employerName
            subjects {
                id
                standardId
                boardId
                subjectId
            }
        }
    }
`;

describe('experience operations', () => {
    const experienceData: Partial<Experience> = {
        title: faker.lorem.words(),
        employerName: faker.lorem.words(),
        start: '2015-01-01',
        end: '2016-12-30',
        description: faker.lorem.paragraph(),
        type: EmployerTypeEnum.School,
    };
    const subStdBoardData: Partial<SubStdBoard>[] = [
        {
            subjectId: 1,
            standardId: 1,
            boardId: 1,
        },
        {
            boardId: 1,
            standardId: 2,
            subjectId: 2,
        },
    ];
    const updateData: Partial<Experience> = {
        currentlyWorking: true,
        title: 'asdfasdfasdfasdf',
    };
    const updateSubStdBoardData: Partial<SubStdBoard>[] = [
        {
            subjectId: 2,
            boardId: 2,
            standardId: 2,
        },
    ];

    it('should add new experience', async () => {
        let response = await mutate(addExeperienceMutation, {
            variables: {
                data: experienceData,
                subjects: subStdBoardData,
            },
        });

        expect(response).toMatchObject({
            data: {
                addExperience: {
                    entity: {
                        start: experienceData.start,
                        end: experienceData.end,
                        type: experienceData.type,
                    },
                },
            },
        });
        // @ts-ignore
        expect(response.data.addExperience.entity.subjects.length).toBe(2);
    });

    it('should update experience', async () => {
        let response = await mutate(updateExperienceMutation, {
            variables: {
                data: updateData,
                subjects: updateSubStdBoardData,
                experienceId: 1,
            },
        });

        expect(response).toMatchObject({
            data: {
                updateExperience: {
                    entity: {
                        currentlyWorking: true,
                        end: null,
                    },
                },
            },
        });
        // @ts-ignore
        expect(response.data.updateExperience.entity.subjects.length).toBe(1);
    });

    it('should get all experiences', async () => {
        let response = await query(getAllExperiencesQuery);
        // @ts-ignore
        expect(response.data.getAllExperiences.length).toBeGreaterThan(1);
        // @ts-ignore
        expect(response.data.getAllExperiences[0].subjects).toBeDefined();
    });

    it('should get single experience', async () => {
        let response = await query(getExperienceQuery, {
            variables: {
                experienceId: 1,
            },
        });
        expect(response.data).toMatchObject({
            getExperience: {
                title: 'asdfasdfasdfasdf',
                employerName: 'animi aut quo',
                start: '2015-01-01',
                end: null,
                description:
                    'At vel cum velit. Debitis soluta sunt. Porro cum aut eum quia temporibus. Voluptas quia placeat adipisci est saepe dolorem eum rerum dolorem.',
                type: EmployerTypeEnum.School,
            },
        });
        // @ts-ignore
        expect(response.data.getExperience.subjects.length).toBe(1);
    });

    it('should throw error for creating experience without subjects', async () => {
        let response = await mutate(addExeperienceMutation, {
            variables: {
                data: experienceData,
            },
        });
        expect(response.data).toBeNull();
        expect(response.errors!.length).toBeGreaterThan(0);
    });

    it('should delete qualification', async () => {
        await mutate(deleteExperienceMutation, {
            variables: {
                experienceId: 1,
            },
        });
        let response = await query(getExperienceQuery, {
            variables: {
                experienceId: 1,
            },
        });
        expect(response.data).toBeNull();
        expect(response.errors!.length).toBeGreaterThan(0);
    });
});
