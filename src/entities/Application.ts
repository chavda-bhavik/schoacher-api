import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Requirement, Teacher } from '.';

@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
    teacher: Partial<Teacher>;

    @Column()
    teacherId: number;

    @ManyToOne(() => Requirement, { onDelete: 'CASCADE' })
    requirement: Partial<Requirement>;

    @Column()
    requirementId: number;
}
