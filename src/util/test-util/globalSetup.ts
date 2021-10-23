import { ConnectionOptions, getConnectionOptions, createConnection } from 'typeorm';
import { Teacher, Employer, Qualification } from '../../entities';

let teacherData: Partial<Teacher>[] = [
    {
        firstName: 'john',
        lastName: 'doe',
        email: 'johndoe@gmail.com',
        password: '$2a$12$G.8US.fY2TvLAkgvQkIaRe5Yj3ujd4LWhwb8tyz98/LVSqqIy4AKW', // john@123
    },
];
let employerData: Partial<Employer>[] = [
    {
        name: 'XYZ School',
        email: 'xyz@gmail.com',
        password: '$2a$12$DqTMH3E8j4YOSobwy1boY.7.ZsmUml1Ha.aACNs7BvVNdX4X7H4Ue',
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
};
