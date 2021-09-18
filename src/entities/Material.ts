import { Field, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Teacher } from '.';
import { SubStdBoard } from './SubStdBoard';

@ObjectType()
@Entity()
export class Material extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
    teacher: Partial<Teacher>;

    @Field()
    @Column()
    title: string;

    @OneToMany(() => SubStdBoard, (sub) => sub.material, {
        cascade: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    subjects?: SubStdBoard[];

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'text' })
    description: string;

    @Field()
    @Column({ type: 'text' })
    fileUrl: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @DeleteDateColumn()
    deleted!: Date;
}
