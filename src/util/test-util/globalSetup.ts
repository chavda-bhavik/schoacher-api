import { EmployerTypeEnum, RequirementTypeEnum } from '../../constants';
import { ConnectionOptions, getConnectionOptions, createConnection } from 'typeorm';
import { Teacher, Employer, Qualification, Board, Standard, Subject, Experience, SubStdBoard, Requirement, Address } from '../../entities';

export default async () => {
    const options: ConnectionOptions = await getConnectionOptions('test');
    let conn = await createConnection({
        ...options,
        synchronize: true,
        dropSchema: true,
        name: 'test',
    });
    let qb = await conn.createQueryBuilder();
    await qb.insert().into(Teacher).values(teacherData).execute();
    await qb.insert().into(Employer).values(employerData).execute();
    await qb.insert().into(Qualification).values(qualificationsData).execute();
    await qb.insert().into(Board).values(BoardsData).execute();
    await qb.insert().into(Subject).values(SubjectsData).execute();
    await qb.insert().into(Standard).values(StandardsData).execute();
    await qb.insert().into(Experience).values(ExperienceData).execute();
    await qb.insert().into(SubStdBoard).values(ExperienceSubStdBoardData).execute();
    await qb.insert().into(Requirement).values(requirementsData).execute();
    await qb.insert().into(Address).values(addressData).execute();
    // adding subjects for each requirement
    await qb
        .insert()
        .into(SubStdBoard)
        .values(requirementSubStdBoardData.map((req) => ({ ...req, requirement_id: 1 })))
        .execute();
    await qb
        .insert()
        .into(SubStdBoard)
        .values(requirementSubStdBoardData.map((req) => ({ ...req, requirement_id: 2 })))
        .execute();
    await qb
        .insert()
        .into(SubStdBoard)
        .values(requirementSubStdBoardData.map((req) => ({ ...req, requirement_id: 3 })))
        .execute();
    await qb
        .insert()
        .into(SubStdBoard)
        .values(requirementSubStdBoardData.map((req) => ({ ...req, requirement_id: 4 })))
        .execute();
    await qb
        .insert()
        .into(SubStdBoard)
        .values(requirementSubStdBoardData.map((req) => ({ ...req, requirement_id: 5 })))
        .execute();
};

let teacherData: Partial<Teacher>[] = [
    {
        firstName: 'john',
        lastName: 'doe',
        email: 'johndoe@gmail.com',
        password: '$2a$12$G.8US.fY2TvLAkgvQkIaRe5Yj3ujd4LWhwb8tyz98/LVSqqIy4AKW', // john@123
    },
];
let qualificationsData: Partial<Qualification>[] = [
    {
        start: '2021-09-18T05:56:23.926Z',
        end: '2021-07-22T22:33:00.631Z',
        college: 'Veum, Smitham and Gerhold',
        degree: 'quisquam maxime quo',
        grade: 'A+',
        description: 'International',
        teacherId: 1,
    },
    {
        start: '2015-09-12',
        end: '2016-07-22',
        college: 'ABCD College',
        degree: 'quisquam maxime quo',
        grade: '87.45',
        description: 'International asdfasdff asdf',
        teacherId: 1,
    },
];
let BoardsData: Partial<Board>[] = [
    {
        label: 'Gujarat Secondary & Higher Secondary Education Board',
        value: 'GSEB',
    },
    {
        label: 'National Council of Education Reasearch & Training',
        value: 'NCERT',
    },
];
let StandardsData: Partial<Standard>[] = [
    {
        label: 'Senior Kinder Garden',
        value: 'SKG',
    },
    {
        label: 'Junior Kinder Garden',
        value: 'JKG',
    },
    {
        label: 'Nursery',
        value: 'Nursery',
    },
    {
        label: '1',
        value: '1',
    },
    {
        label: '2',
        value: '2',
    },
    {
        label: '3',
        value: '3',
    },
    {
        label: '4',
        value: '4',
    },
    {
        label: '5',
        value: '5',
    },
    {
        label: '6',
        value: '6',
    },
    {
        label: '7',
        value: '7',
    },
    {
        label: '8',
        value: '8',
    },
    {
        label: '9',
        value: '9',
    },
    {
        label: '10',
        value: '10',
    },
];
let SubjectsData: Partial<Subject>[] = [
    {
        label: 'Gujarati',
        value: 'Gujarati',
    },
    {
        label: 'Engilish',
        value: 'English',
    },
    {
        label: 'Hindi',
        value: 'Hindi',
    },
    {
        label: 'Sanskrit',
        value: 'Sanskrit',
    },
    {
        label: 'All',
        value: 'All',
    },
];
let ExperienceSubStdBoardData: Partial<SubStdBoard>[] = [
    {
        subjectId: 1,
        standardId: 1,
        boardId: 1,
        experience_id: 1,
    },
    {
        subjectId: 2,
        standardId: 1,
        boardId: 1,
        experience_id: 1,
    },
    {
        subjectId: 3,
        standardId: 2,
        boardId: 1,
        experience_id: 1,
    },
];
let ExperienceData: Partial<Experience>[] = [
    {
        title: 'adipisci voluptas autem',
        employerName: 'animi aut quo',
        start: '2015-01-01',
        end: '2016-12-30',
        description:
            'At vel cum velit. Debitis soluta sunt. Porro cum aut eum quia temporibus. Voluptas quia placeat adipisci est saepe dolorem eum rerum dolorem.',
        type: EmployerTypeEnum.School,
        teacherId: 1,
    },
];

// employer
let employerData: Partial<Employer>[] = [
    {
        name: 'XYZ School',
        email: 'xyz@gmail.com',
        type: EmployerTypeEnum.School,
        password: '$2a$12$DqTMH3E8j4YOSobwy1boY.7.ZsmUml1Ha.aACNs7BvVNdX4X7H4Ue', // xyz@123
    },
    {
        name: 'Saraswati Vidhyalaya',
        email: 'contact@saraswati.com',
        type: EmployerTypeEnum.School,
        password: '$2a$10$/tqHdydBfss8ndw5sJzFuOrTUKmgC6UB3ifkpbIZ0vTND4Y/fFHEy', // saraswati@123
    },
];
let addressData: Partial<Address>[] = [
    {
        street1: 'adfasdf asf',
        street2: 'werzxdr qwe qwe qwe qwe',
        state: 'Gujarat',
        city: 'Surat',
        pincode: 395008,
        employer_id: 1,
    },
    {
        street1: 'wer we werdf asf',
        street2: 'werzx asdf qwe qwe',
        state: 'Gujarat',
        city: 'Rajkot',
        pincode: 392008,
        employer_id: 2,
    },
];
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
let requirementsData: Partial<Requirement>[] = [
    {
        employerId: 1,
        startTime: '2021-10-24T02:00:27.001Z',
        endTime: '2021-10-24T07:30:27.001Z',
        description: 'asdf asdf asdf asdf asdf',
        qualification: 'Master Degree',
        salaryFrom: 20000,
        salaryUpTo: 50000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        type: RequirementTypeEnum.PART_TIME,
    },
    {
        employerId: 1,
        startTime: '2021-10-24T07:30:27.001Z',
        endTime: '2021-10-24T12:30:27.001Z',
        description: 'asdf asdf asdf asdf asdf',
        qualification: 'Master Degree',
        salaryFrom: 15000,
        salaryUpTo: 40000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        type: RequirementTypeEnum.FULL_TIME,
    },
    {
        employerId: 1,
        startTime: '2021-10-24T07:30:27.001Z',
        endTime: '2021-10-24T12:30:27.001Z',
        description: 'asdf asdf asdf asdf asdf',
        qualification: 'Master Degree',
        salaryFrom: 50000,
        salaryUpTo: 70000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        type: RequirementTypeEnum.FULL_TIME,
    },
    {
        employerId: 2,
        startTime: '2021-10-24T02:00:27.001Z',
        endTime: '2021-10-24T07:30:27.001Z',
        description: 'asdf asdf asdf asdf asdf',
        qualification: 'Master Degree',
        salaryFrom: 20000,
        salaryUpTo: 30000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        type: RequirementTypeEnum.PART_TIME,
    },
    {
        employerId: 2,
        startTime: '2021-10-24T02:00:27.001Z',
        endTime: '2021-10-24T07:30:27.001Z',
        description: 'asdf asdf asdf asdf asdf',
        qualification: 'Master Degree',
        salaryFrom: 15000,
        salaryUpTo: 30000,
        title: 'asdf assddf assdfwer ddqwer zdwer',
        type: RequirementTypeEnum.FULL_TIME,
    },
];
