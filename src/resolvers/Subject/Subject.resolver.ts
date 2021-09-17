import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Subject } from '@/entities';
import { createEntity, getData } from '@/util/typeorm';
import { SubjectResponseType } from '../SharedTypes';
import { SubjectInputType } from './SubjectTypes';

@Resolver(Subject)
export class SubjectResolver {
    @Mutation(() => SubjectResponseType)
    async addSubject(@Arg('data') data: SubjectInputType): Promise<SubjectResponseType> {
        let subject = createEntity(Subject, data);
        return subject;
    }

    @Query(() => [Subject])
    async subjects(): Promise<Subject[]> {
        let subjects = await getData(Subject);
        return subjects;
    }
}
