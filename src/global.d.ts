import { Request, Response } from 'express';
import { Employer, Teacher } from './entities';
interface FileField {
    path: string;
    uploadName: string;
    mimetype: string;
}
interface sessionStore {
    token: string;
    userType: 'teacher' | 'employer';
}
interface cookiesStore {
    token?: string;
}
type MyContext = {
    req: Request & { cookies: cookiesStore };
    res: Response;
    user: Teacher | Employer;
};
type TeacherContext = {
    req: Request & { cookies: cookiesStore };
    res: Response;
    user: Teacher;
};
type EmployerContext = {
    req: Request & { cookies: cookiesStore };
    res: Response;
    user: Employer;
};
interface TokenDecoded {
    id: number;
    type: 'teacher' | 'employer';
    iat?: number;
}
