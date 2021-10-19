import { ConnectionOptions, getConnectionOptions, createConnection } from 'typeorm';
import { Teacher, Employer } from '../../entities';

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
};
