import { RegularExpresssions } from '../constants';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import * as Yup from 'yup';
import { Requirement, SubStdBoard } from '.';
import { EmployerTypeEnum } from '../constants';
import { Address } from './Address';

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
            .test('valid', 'Mobile Number is not valid', (val) => (val ? RegularExpresssions.mobile.test(val) : true)),
    });

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'text' })
    name: string;

    @Field()
    @Column({
        type: 'enum',
        enum: EmployerTypeEnum,
        default: EmployerTypeEnum.School,
    })
    type: EmployerTypeEnum;

    @Column()
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
    @Column({ nullable: true, default: 'https://source.unsplash.com/umhyDLYKfLM/350x250' })
    photoUrl: string;

    @OneToMany(() => SubStdBoard, (sub) => sub.employer, {
        cascade: true,
    })
    subjects?: SubStdBoard[];

    @OneToMany(() => Requirement, (req) => req.employer)
    requirements?: Requirement[];

    @Field(() => Address, { nullable: true })
    // @OneToOne(() => Address, (addr) => addr.employer)
    // @JoinColumn({ name: 'address_id' })
    address?: Address;

    @Column({ nullable: true })
    address_id: number;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;
}
