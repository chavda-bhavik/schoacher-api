import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Subject, SubStdBoard, Board, Standard } from '@/entities';
import { findEntityOrThrow } from '@/util/typeorm';

@Resolver(SubStdBoard)
export class SubStdBoardResolver {
    @FieldResolver(() => Subject)
    subject(@Root() ssb: SubStdBoard) {
        return findEntityOrThrow(Subject, ssb.subjectId);
    }

    @FieldResolver(() => Board)
    board(@Root() ssb: SubStdBoard) {
        return findEntityOrThrow(Board, ssb.boardId);
    }

    @FieldResolver(() => Standard)
    standard(@Root() ssb: SubStdBoard) {
        return findEntityOrThrow(Standard, ssb.standardId);
    }
}
