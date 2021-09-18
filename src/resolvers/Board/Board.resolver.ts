import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Board } from '@/entities';
import { createEntity, getData } from '@/util/typeorm';
import { BoardResponseType } from '../SharedTypes';
import { BoardInputType } from './BoardTypes';

@Resolver(Board)
export class BoardResolver {
    @Mutation(() => BoardResponseType)
    async addBoard(@Arg('data') data: BoardInputType): Promise<BoardResponseType> {
        let board = createEntity(Board, data);
        return board;
    }

    @Query(() => [Board])
    async boards(): Promise<Board[]> {
        let boards = await getData(Board);
        return boards;
    }
}
