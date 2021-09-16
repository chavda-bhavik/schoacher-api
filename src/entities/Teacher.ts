import { RegularExpresssions } from '@/constants';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as Yup from 'yup';

@ObjectType()
@Entity()
export class Teacher extends BaseEntity {
    static validations = Yup.object().shape({
        firstName: Yup.string().required().max(100),
        lastName: Yup.string().required().max(100),
        mobile1: Yup.string()
            .nullable()
            .test('valid', 'Mobile Number is not valid', (val) => (val ? RegularExpresssions.mobile.test(val) : true)),
        mobile2: Yup.string()
            .nullable()
            .test('valid', 'Mobile Number is not valid', (val) => (val ? RegularExpresssions.mobile.test(val) : true)),
        gender: Yup.number().test('valid', 'Gender is Not Valid', (val) => (val ? [0, 1].includes(val) : true)),
        email: Yup.string()
            .max(200)
            .test('valid', 'Email is not valid', (val) => !!val && RegularExpresssions.email.test(val))
            .test('unique', 'Email is already registered', async (val) => {
                return !!val && !Boolean(await Teacher.count({ where: { email: val } }));
            }),
    });

    @Field()
    @PrimaryGeneratedColumn()
    id: string;

    @Field()
    @Column({ type: 'text' })
    firstName: string;

    @Field()
    @Column({ type: 'text' })
    lastName: string;

    @Field()
    @Column({ nullable: true, type: 'text' })
    password: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    mobile1: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    mobile2: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    headline: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    address: string;

    @Field()
    @Column({ default: 1, type: 'numeric' })
    gender: Number;

    @Field()
    @Column({ type: 'text', unique: true })
    email: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
