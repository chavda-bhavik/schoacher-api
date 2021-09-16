import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { ValidationError } from 'yup';

import { User, Teacher, Qualification } from '@/entities';
import { FieldError } from '@/resolvers/SharedTypes';

type EntityConstructor = typeof User | typeof Teacher | typeof Qualification;
type EntityInstance = User | Teacher | Qualification;

const entities: { [key: string]: EntityConstructor } = { User, Teacher, Qualification };

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

export const removeEntity = async <T extends EntityConstructor>(Constructor: T, id: number | string, hard?: boolean): Promise<InstanceType<T>> => {
    const instance = await findEntityOrThrow(Constructor, id);
    if (hard) await instance.remove();
    else await instance.softRemove();
    return instance;
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
