import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employer } from '.';

@ObjectType()
@Entity()
export class Address extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({ type: 'text' })
    street1: string;

    @Field()
    @Column({ type: 'text' })
    street2: string;

    @Field()
    @Column({ type: 'text' })
    city: string;

    @Field()
    @Column({ type: 'text' })
    state: string;

    @Field()
    @Column({ type: 'numeric' })
    pincode: number;

    @OneToOne(() => Employer, (emp) => emp.address)
    @JoinColumn({ name: 'employer_id' })
    employer: Employer;

    @Column({ type: 'numeric' })
    employer_id: number;
}
