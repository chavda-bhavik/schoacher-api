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

    // it('should get all journal entries for the date month', async () => {
    //     let response = await gCall({
    //         source: allJournalsQuery,
    //         variableValues: {
    //             date
    //         }
    //     });
    //     expect(response && response?.data?.getAllJournals.length).toBeGreaterThan(0);
    // });
    // it('should get single journal', async () => {
    //     let response = await gCall({
    //         source: getSingleJournal,
    //         variableValues: {
    //             date: date
    //         }
    //     });
    //     expect(response).toMatchObject({
    //         data: {
    //             journal: {
    //                 actions: journal.actions
    //             }
    //         }
    //     });
    // });
    // it("should not get wrong journal", async () => {
    //     let response = await gCall({
    //         source: getSingleJournal,
    //         variableValues: {
    //             date: "01/01/2021"
    //         }
    //     });
    //     expect(response?.data).toBeNull();
    // });
});
