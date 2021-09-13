import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '@/entities/User';
import {
    createEntity,
    findEntityOrThrow,
    getData,
    removeEntity,
    updateEntity,
} from '@/util/typeorm';
import { ResponseType } from '../SharedTypes';
import { UserInputType } from './UserTypes';

@Resolver()
export class UserResolver {
    @Mutation(() => ResponseType)
    async createUser(@Arg('data') data: UserInputType): Promise<ResponseType> {
        let user = createEntity(User, data);
        return user;
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        let users = await getData(User);
        return users;
    }

    @Query(() => User)
    async user(@Arg('id') id: number): Promise<User | undefined> {
        let user = await findEntityOrThrow(User, id);
        return user;
    }

    @Mutation(() => ResponseType)
    async updateUser(
        @Arg('id') id: number,
        @Arg('data') data: UserInputType,
    ): Promise<ResponseType> {
        return updateEntity(User, id, data);
    }

    @Mutation(() => User)
    async deleteUser(@Arg('id') id: number): Promise<User | undefined> {
        return removeEntity(User, id);
    }
}
