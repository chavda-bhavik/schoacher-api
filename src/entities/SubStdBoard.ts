import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Experience, Employer, Standard, Board, Subject, Material, Requirement } from '.';

@ObjectType()
@Entity()
export class SubStdBoard extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Standard)
    @ManyToOne(() => Standard)
    standard: Partial<Standard>;

    @Field()
    @Column()
    standardId: number;

    @Field(() => Board)
    @ManyToOne(() => Board)
    board: Partial<Board>;

    @Field()
    @Column()
    boardId: number;

    @Field(() => Subject)
    @ManyToOne(() => Subject)
    subject: Partial<Subject>;

    @Field()
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

    @ManyToOne(() => Employer, (mat) => mat.subjects, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'employer_id' })
    employer: Partial<Employer>;

    @Column({ nullable: true })
    employer_id: number;

    @ManyToOne(() => Requirement, (mat) => mat.subjects, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'requirement_id' })
    requirement: Partial<Requirement>;

    @Column({ nullable: true })
    requirement_id: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
