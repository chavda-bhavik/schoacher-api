import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Employer, SubStdBoard } from '.';
import { RequirementTypeEnum } from '../constants';

@ObjectType()
@Entity()
export class Requirement extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employer, { onDelete: 'CASCADE' })
    employer: Partial<Employer>;

    @Column()
    employerId: number;

    @Field()
    @Column({ type: 'text' })
    title: string;

    @Field(() => RequirementTypeEnum)
    @Column({
        type: 'enum',
        enum: RequirementTypeEnum,
        default: RequirementTypeEnum.FULL_TIME,
    })
    type: RequirementTypeEnum;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    qualification: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'timestamp' })
    startTime: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'timestamp' })
    endTime: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    salaryFrom: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    salaryUpTo: number;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    description: string;

    @OneToMany(() => SubStdBoard, (sub) => sub.requirement, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    subjects?: SubStdBoard[];

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
