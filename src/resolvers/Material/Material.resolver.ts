import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Material, SubStdBoard } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity, saveSubjects } from '@/util/typeorm';
import { MaterialResponseType, SubStdBoardType } from '../SharedTypes';
import { MaterialType } from './MaterialTypes';

@Resolver(Material)
export class MaterialResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() material: Material) {
        return getData(SubStdBoard, { where: { material_id: material.id } });
    }

    @Mutation(() => MaterialResponseType)
    async addMaterial(
        @Arg('teacherId') teacherId: number,
        @Arg('data') data: MaterialType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<MaterialResponseType> {
        let material = await createEntity(Material, {
            ...data,
            teacher: { id: teacherId },
        });
        if (material.entity && subjects) {
            await saveSubjects(material.entity, 'material_id', material.entity.id, subjects);
        }
        return material;
    }

    @Query(() => [Material])
    async getAllMaterials(@Arg('teacherId') teacherId: number): Promise<Material[] | undefined> {
        let materials = getData(Material, { where: { teacher: { id: teacherId } } });
        return materials;
    }

    @Mutation(() => MaterialResponseType)
    async updateMaterial(
        @Arg('materialId') id: number,
        @Arg('data') data: MaterialType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<MaterialResponseType> {
        let material = await updateEntity(Material, id, data);
        if (material.entity && subjects) {
            await saveSubjects(material.entity, 'material_id', material.entity.id, subjects);
        }
        return material;
    }

    @Mutation(() => Material)
    async deleteMaterial(@Arg('teacherId') teacherId: number, @Arg('materialId') materialId: number): Promise<Material | undefined> {
        return removeEntity(Material, undefined, { where: { id: materialId, teacher: { id: teacherId } } });
    }

    @Query(() => Material)
    async getMaterial(@Arg('teacherId') teacherId: number, @Arg('materialId') materialId: number): Promise<Material | undefined> {
        let material = await findEntityOrThrow(Material, undefined, { where: { id: materialId, teacher: { id: teacherId } } });
        return material;
    }
}