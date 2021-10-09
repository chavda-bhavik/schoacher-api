import { Request, Response } from 'express';
import { Employer, Teacher } from './entities';
interface FileField {
    path: string
    uploadName: string
    mimetype: string
}
interface sessionStore {
    token: string;
    userType: 'teacher' | 'employer';
}
type MyContext = {
    req: Request & { session: sessionStore };
    res: Response;
    user: Teacher | Employer;
};
type TeacherContext = {
    req: Request & { session: sessionStore };
    res: Response;
    user: Teacher;
}
type EmployerContext = {
    req: Request & { session: sessionStore };
    res: Response;
    user: Employer;
}
interface TokenDecoded {
    id: number;
    type: 'teacher' | 'employer';
    iat?: number
}