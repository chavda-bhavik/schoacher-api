import { createTestClient, TestQuery } from 'apollo-server-integration-testing';
import { Connection } from 'typeorm';

import { Requirement, SubStdBoard } from '../../entities';
import { XYZEmployerJWTToken } from '../../util/test-util';
import { createApolloServer, testConn } from '../../util/test-util';

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

const getAllRequirementsQuery = `
    query Query {
        getAllRequirements {
            title
            id
            type
            qualification
            startTime
            endTime
            salaryFrom
            salaryUpTo
            description
        }
    }
`;
const getRequirementQuery = `
    query Query($requirementId: Float!) {
        getRequirement(requirementId: $requirementId) {
            id
            title
            type
            qualification
            startTime
            endTime
            salaryFrom
            salaryUpTo
            description
            subjects {
                id
                standardId
                subjectId
                boardId
            }
        }
    }
`;
const createRequirementMutation = `
    mutation Mutation($data: RequirementType!, $subjects: [SubStdBoardType!]) {
        addRequirement(data: $data, subjects: $subjects) {
            errors {
                field
                message
            }
            entity {
                id
                title
                type
                qualification
                startTime
                endTime
                salaryFrom
                salaryUpTo
                description
                subjects {
                    id
                }
            }
        }
    }
`;
const updateRequirementMutation = `
    mutation Mutation($data: RequirementType!, $requirementId: Float!, $subjects: [SubStdBoardType!]) {
        updateRequirement(data: $data, requirementId: $requirementId, subjects: $subjects) {
            errors {
                field
                message
            }
            entity {
                    id
                title
                type
                qualification
                startTime
                endTime
                salaryFrom
                salaryUpTo
                description
                subjects {
                    id
                }
            }
        }
    }
`;
const deleteRequirementMutation = `
    mutation Mutation($requirementId: Float!) {
        deleteRequirement(requirementId: $requirementId) {
            id
        }
    }
`;

describe('requirement operations', () => {
    let requirementData: Partial<Requirement> = {
        startTime: '2021-10-24T02:00:27.001Z',
        endTime: '2021-10-24T07:30:27.001Z',
        description: 'asdf asdf asdf asdf asdf',
        qualification: 'Master Degree',
        salaryFrom: 20000,
        salaryUpTo: 50000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        // @ts-ignore
        type: 'FULL_TIME',
    };
    let requirementSubStdBoardData: Partial<SubStdBoard>[] = [
        {
            subjectId: 1,
            standardId: 1,
            boardId: 1,
        },
        {
            subjectId: 2,
            standardId: 1,
            boardId: 1,
        },
        {
            subjectId: 3,
            standardId: 2,
            boardId: 1,
        },
    ];
    let updateData: Partial<Requirement> = {
        qualification: 'Bechlor Degree',
        salaryFrom: 10000,
        salaryUpTo: 150000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        // @ts-ignore
        type: 'PART_TIME',
    };
    let updateSubStdBoardData: Partial<SubStdBoard>[] = [
        {
            subjectId: 1,
            standardId: 1,
            boardId: 1,
        },
        {
            subjectId: 2,
            standardId: 1,
            boardId: 1,
        },
    ];

    it('should create new requirement', async () => {
        const response = await mutate(createRequirementMutation, {
            variables: {
                data: requirementData,
                subjects: requirementSubStdBoardData,
            },
        });

        expect(response.data).toMatchObject({
            addRequirement: {
                entity: {
                    ...requirementData,
                },
            },
        });
        // @ts-ignore
        expect(response.data.addRequirement.entity.subjects.length).toBe(3);
    });

    it('should update requirement', async () => {
        const response = await mutate(updateRequirementMutation, {
            variables: {
                data: updateData,
                subjects: updateSubStdBoardData,
                requirementId: 2,
            },
        });
        expect(response.data).toMatchObject({
            updateRequirement: {
                entity: {
                    ...updateData,
                },
            },
        });
        // @ts-ignore
        expect(response.data.updateRequirement.entity.subjects.length).toBe(2);
    });

    it('should get all requirements for employer', async () => {
        let response = await query(getAllRequirementsQuery);
        // @ts-ignore
        expect(response.data.getAllRequirements.length).toBeGreaterThan(3); // 3 are added while setup, 1 added while running testcase
    });

    it('should get single requirement', async () => {
        let response = await query(getRequirementQuery, {
            variables: {
                requirementId: 1,
            },
        });
        // @ts-ignore
        expect(response.data.getRequirement).toBeDefined();
        expect(response.data).toMatchObject({
            getRequirement: {
                description: 'asdf asdf asdf asdf asdf',
                qualification: 'Master Degree',
                salaryFrom: 20000,
                salaryUpTo: 50000,
                title: 'asdf assddf assdfwer ddqwer zdwer',
                type: 'PART_TIME',
            },
        });
        // @ts-ignore
        expect(response.data.getRequirement.subjects.length).toBe(3);
    });

    it('should delete requirement', async () => {
        await mutate(deleteRequirementMutation, {
            variables: {
                requirementId: 2,
            },
        });
        let response = await query(getRequirementQuery, {
            variables: {
                requirementId: 2,
            },
        });
        expect(response.data).toBeNull();
        expect(response.errors!.length).toBeGreaterThan(0);
    });
});
