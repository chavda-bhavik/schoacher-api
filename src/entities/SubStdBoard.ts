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
import { Experience, Employer, Standard, Board, Subject, Material } from '.';

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

    @Column({ nullable: true })
    experience_id: number;

    @ManyToOne(() => Material, (mat) => mat.subjects)
    @JoinColumn({ name: 'material_id' })
    material: Partial<Material>;

    @Column({ nullable: true })
    material_id: number;

    @ManyToOne(() => Employer, (mat) => mat.subjects)
    @JoinColumn({ name: 'employer_id' })
    employer: Partial<Employer>;

    @Column({ nullable: true })
    employer_id: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
