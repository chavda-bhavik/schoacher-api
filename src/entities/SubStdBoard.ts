import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Column,
} from 'typeorm';
import { Subject } from './Subject';
import { Board } from './Board';
import { Standard } from './Standard';
import { Experience } from '.';
import { Material } from './Material';

@ObjectType()
@Entity()
export class SubStdBoard extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Standard)
    @ManyToOne(() => Standard)
    standard: Partial<Standard>;

    @Column()
    standardId: number;

    @Field(() => Board)
    @ManyToOne(() => Board)
    board: Partial<Board>;

    @Column()
    boardId: number;

    @Field(() => Subject)
    @ManyToOne(() => Subject)
    subject: Partial<Subject>;

    @Column()
    subjectId: number;

    @ManyToOne(() => Experience, (exp) => exp.subjects)
    @JoinColumn({ name: 'experience_id' })
    experience: Partial<Experience>;

    @ManyToOne(() => Material, (mat) => mat.subjects)
    @JoinColumn({ name: 'material_id' })
    material: Partial<Material>;

    @Column({ nullable: true })
    material_id: number;

    @Column({ nullable: true })
    experience_id: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
