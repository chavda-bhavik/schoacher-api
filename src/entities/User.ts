import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import * as Yup from 'yup';

@ObjectType()
@Entity()
export class User extends BaseEntity {
    static validations = Yup.object().shape({
        firstName: Yup.string().required().max(100),
        lastName: Yup.string().required().max(100),
        email: Yup.string()
            .required()
            .max(200)
            .test('valid', 'Email is not valid', (val) => !!val && /.+@.+\..+/.test(val))
            .test(
                'unique',
                'Email is already registered',
                async (val) => !!val && !Boolean(await User.count({ where: { email: val } })),
            ),
    });

    @Field()
    @PrimaryGeneratedColumn()
    id: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    firstName: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    lastName: string;

    @Field()
    @Column({ type: 'text', unique: true })
    email!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
