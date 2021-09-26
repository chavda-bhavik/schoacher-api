import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ValidationError } from 'yup';
import { getConnection } from 'typeorm';

import { User, Teacher, Qualification, Experience, SubStdBoard, Board, Standard, Subject, Material, Employer, Requirement } from '@/entities';
import { FieldError, SubStdBoardType } from '@/resolvers/SharedTypes';

type EntityConstructor =
    | typeof User
    | typeof Teacher
    | typeof Qualification
    | typeof Experience
    | typeof Subject
    | typeof Standard
    | typeof Board
    | typeof SubStdBoard
    | typeof Material
    | typeof Employer
    | typeof Requirement;

type EntityInstance = User | Teacher | Qualification | Experience | SubStdBoard | Board | Standard | Subject | Material | Employer | Requirement;
type SubjectsEntityInstance = Experience | Material | Employer | Requirement;

const entities: { [key: string]: EntityConstructor } = {
    User,
    Teacher,
    Qualification,
    Experience,
    Subject,
    Standard,
    Board,
    SubStdBoard,
    Material,
    Employer,
    Requirement,
};

export const getData = async <T extends EntityConstructor>(Constructor: T, options?: FindOneOptions): Promise<InstanceType<T>[]> => {
    let data = await Constructor.find(options);
    return data as InstanceType<T>[];
};

export const findEntityOrThrow = async <T extends EntityConstructor>(
    Constructor: T,
    id?: number | string,
    options?: FindOneOptions,
    throwError = true,
): Promise<InstanceType<T>> => {
    let instance;
    if (id) {
        instance = await Constructor.findOne(id, options);
    } else {
        instance = await Constructor.findOne(options);
    }
    if (!instance && throwError) {
        throw new Error(`${Constructor.name} Not Found`);
    }
    return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(instance: T): Promise<{ entity?: T; errors?: FieldError[] }> => {
    const Constructor = entities[instance.constructor.name];

    if ('validations' in Constructor) {
        try {
            await Constructor.validations.validate(instance, { abortEarly: false });
        } catch (errors: any) {
            return { errors: formatYupError(errors) };
        }
    }
    return {
        entity: (await instance.save()) as T,
    };
};

export const createEntity = async <T extends EntityConstructor>(Constructor: T, input: Partial<InstanceType<T>>) => {
    const instance = Constructor.create(input);
    return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(Constructor: T, id: number | string, input: Partial<InstanceType<T>>) => {
    const instance = await findEntityOrThrow(Constructor, id);
    Object.assign(instance, input);
    return validateAndSaveEntity(instance);
};

export const removeEntity = async <T extends EntityConstructor>(
    Constructor: T,
    id?: number | string,
    findOptions?: FindOneOptions,
    hard?: boolean,
): Promise<InstanceType<T>> => {
    const instance = await findEntityOrThrow(Constructor, id, findOptions);
    let instanceCopy = Object.assign({}, instance);
    if (hard || !('deleted' in Constructor)) await instance.remove();
    else await instance.softRemove();
    return instanceCopy;
};

export const formatYupError = (err: ValidationError) => {
    const errors: Array<{ field: string; message: string }> = [];
    err.inner.forEach((e) => {
        errors.push({
            field: e.path || '',
            message: e.message,
        });
    });

    return errors;
};

export const saveSubjects = async (
    entity: SubjectsEntityInstance,
    subjectsFieldName: 'material_id' | 'experience_id' | 'requirement_id' | 'employer_id',
    fieldValue: string | number,
    subjects: SubStdBoardType[],
): Promise<SubjectsEntityInstance> => {
    // delete subjects of entity
    await getConnection().createQueryBuilder().delete().from(SubStdBoard).where(`"${subjectsFieldName}" = :id1`, { id1: fieldValue }).execute();

    // add subjects to entity
    let subjectsSet = new Set();
    let newSubjects = subjects.reduce((subjectsArr: SubStdBoard[], sub) => {
        // checking uniqueNess of subjects, if subject is exists in set do not add it
        if (!subjectsSet.has(`${sub.boardId}${sub.standardId}${sub.subjectId}`)) {
            let newSubStdBoard = new SubStdBoard();
            newSubStdBoard.subject = { id: sub.subjectId };
            newSubStdBoard.standard = { id: sub.standardId };
            newSubStdBoard.board = { id: sub.boardId };
            subjectsArr.push(newSubStdBoard);
            subjectsSet.add(`${sub.boardId}${sub.standardId}${sub.subjectId}`);
        }
        return subjectsArr;
    }, []);
    entity.subjects = newSubjects;

    // save entity
    await entity.save();

    return entity;
};
