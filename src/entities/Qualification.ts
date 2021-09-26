import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import * as Yup from 'yup';

import { Teacher } from '.';

@ObjectType()
@Entity()
export class Qualification extends BaseEntity {
    static validations = Yup.object().shape({
        degree: Yup.string().required(),
        college: Yup.string().required(),
        start: Yup.date().required(),
        end: Yup.date().required(),
    });

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
    teacher: Partial<Teacher>;

    @Column()
    teacherId: number;

    @Field()
    @Column({ type: 'date' })
    start: string;

    @Field()
    @Column({ type: 'date' })
    end: string;

    @Field()
    @Column({ type: 'text' })
    college: string;

    @Field()
    @Column({ type: 'text' })
    degree: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    description: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    grade: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
