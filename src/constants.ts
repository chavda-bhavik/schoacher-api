export const __prod__ = process.env.NODE_ENV === 'production';
export const RegularExpresssions = {
    email: /.+@.+\..+/,
    mobile: /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
};

export enum EmployerTypeEnum {
    SCHOOL = 'School',
    TUTION = 'Tution',
    HOMEBATCH = 'Home Batch',
}
export enum RequirementTypeEnum {
    FULL_TIME = "Full Time",
    PART_TIME = "Part Time"
}