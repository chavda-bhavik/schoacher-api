import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Requirement, Teacher } from '.';

@ObjectType()
@Entity()
export class Application extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
    teacher: Partial<Teacher>;

    @Column()
    teacherId: number;

    @ManyToOne(() => Requirement, { onDelete: 'CASCADE' })
    requirement: Partial<Requirement>;

    @Column()
    requirementId: number;
}
