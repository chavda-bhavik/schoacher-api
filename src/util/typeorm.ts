import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { getConnection } from 'typeorm';
import { ValidationError } from 'yup';

import { User } from '@/entities/User';
import { FieldError } from '@/resolvers/SharedTypes';

type EntityConstructor = typeof User;
type EntityInstance = User;

const entities: { [key: string]: EntityConstructor } = { User };

export const getData = async <T extends EntityConstructor>(
    Constructor: T,
    userId?: number | string,
    orderBy?: 'ASC' | 'DESC' | undefined,
): Promise<InstanceType<T>[]> => {
    let query = await getConnection()
        .createQueryBuilder()
        .select('entities')
        .from(Constructor, 'entities');

    if (userId) {
        query.where('"entities"."userId" = :userId', { userId });
    }

    if (orderBy) {
        query.orderBy('"entities"."date"', orderBy);
    }
    let data = await query.getMany();
    return data as InstanceType<T>[];
};

export const findEntityOrThrow = async <T extends EntityConstructor>(
    Constructor: T,
    id: number | string,
    options?: FindOneOptions,
): Promise<InstanceType<T>> => {
    const instance = await Constructor.findOne(id, options);
    if (!instance) {
        throw new Error(`${Constructor.name} Not Found`);
    }
    return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(
    instance: T,
): Promise<{ entity?: T; errors?: FieldError[] }> => {
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

export const createEntity = async <T extends EntityConstructor>(
    Constructor: T,
    input: Partial<InstanceType<T>>,
) => {
    const instance = Constructor.create(input);
    return validateAndSaveEntity(instance as InstanceType<T>);
};

export const updateEntity = async <T extends EntityConstructor>(
    Constructor: T,
    id: number | string,
    input: Partial<InstanceType<T>>,
) => {
    const instance = await findEntityOrThrow(Constructor, id);
    Object.assign(instance, input);
    return validateAndSaveEntity(instance);
};

export const removeEntity = async <T extends EntityConstructor>(
    Constructor: T,
    id: number | string,
    hard?: boolean,
): Promise<InstanceType<T>> => {
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
