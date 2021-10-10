export const __prod__ = process.env.NODE_ENV === 'production';
export const RegularExpresssions = {
    email: /.+@.+\..+/,
    mobile: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
    cloudinaryPublicId: /upload\/(?:v\d+\/)?([^\.]+)/,
};

export enum EmployerTypeEnum {
    School = 'School',
    Tution = 'Tution',
    HomeBatch = 'HomeBatch',
}
export enum RequirementTypeEnum {
    FULL_TIME = 'Full Time',
    PART_TIME = 'Part Time',
}
export enum LoginResponseTypeEnum {
    teacher = 'teacher',
    employer = 'employer'
}
const constants = {
    teacherDefaultPhotoUrl: 'https://res.cloudinary.com/dkuoqamig/image/upload/v1631936323/pxxydj4zsfuqez71im2i.jpg',
    employerDefaultPhotoUrl: 'https://source.unsplash.com/umhyDLYKfLM/350x250',
};

export default constants;
