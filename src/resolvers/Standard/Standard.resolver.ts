import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Standard } from '@/entities';
import { createEntity, getData } from '@/util/typeorm';
import { StandardResponseType } from '../SharedTypes';
import { StandardInputType } from './StandardTypes';

@Resolver(Standard)
export class StandardResolver {
    @Mutation(() => StandardResponseType)
    async addStandard(@Arg('data') data: StandardInputType): Promise<StandardResponseType> {
        let standard = createEntity(Standard, data);
        return standard;
    }

    @Query(() => [Standard])
    async standards(): Promise<Standard[]> {
        let standards = await getData(Standard);
        return standards;
    }
}
