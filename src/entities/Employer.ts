import { RegularExpresssions } from '@/constants';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import * as Yup from 'yup';
import { SubStdBoard } from '.';

@ObjectType()
@Entity()
export class Employer extends BaseEntity {
    static validations = Yup.object().shape({
        name: Yup.string().required().max(200),
        mobile1: Yup.string()
            .nullable()
            .test('valid', 'Mobile Number is not valid', (val) => (val ? RegularExpresssions.mobile.test(val) : true)),
        mobile2: Yup.string()
            .nullable()
            .test('valid', 'Mobile Number is not valid', (val) => (val ? RegularExpresssions.mobile.test(val) : true))
    });

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'text' })
    name: string;

    @Column({ nullable: true, type: 'text' })
    password: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    mobile1: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    mobile2: string;

    @Field()
    @Column({ type: 'text', unique: true })
    email: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    about: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    photoUrl: string;

    @OneToMany(() => SubStdBoard, (sub) => sub.employer, {
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
