import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Teacher } from '.';

export enum ExperienceTypeEnum {
    SCHOOL = 'school',
    TUTION = 'tution',
    HOMEBATCH = 'home batch',
}

@ObjectType()
@Entity()
export class Experience extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
    teacher: Partial<Teacher>;

    @Field()
    @Column({ type: 'date' })
    start: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'date' })
    end: string;

    @Field()
    @Column({ type: 'text' })
    title: string;

    @Field()
    @Column({ type: 'text' })
    instituteName: string;

    @Field()
    @Column({
        type: 'enum',
        enum: ExperienceTypeEnum,
        default: ExperienceTypeEnum.SCHOOL,
    })
    type: ExperienceTypeEnum;

    @Field()
    @Column({ default: false, type: 'boolean' })
    currentlyWorking: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    description: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted!: Date;
}
