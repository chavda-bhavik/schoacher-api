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
export type MyContext = {
    req: Request & { session: sessionStore };
    res: Response;
    userType: 'teacher' | 'employer';
    user: Teacher | Employer;
};
