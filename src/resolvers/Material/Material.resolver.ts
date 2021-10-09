import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Material, SubStdBoard } from '@/entities';
import { createEntity, findEntityOrThrow, updateEntity, getData, removeEntity, saveSubjects } from '@/util/typeorm';
import { MaterialResponseType, SubStdBoardType } from '../SharedTypes';
import { AddMaterialType, UpdateMaterialType } from './MaterialTypes';
import { uploadFile } from '@/util/upload';
import { TeacherAuthMiddleware } from '@/middlewares';
import { TeacherContext } from '@/global';

@Resolver(Material)
export class MaterialResolver {
    @FieldResolver(() => [SubStdBoard])
    subjects(@Root() material: Material) {
        return getData(SubStdBoard, { where: { material_id: material.id } });
    }

    @Mutation(() => MaterialResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async addMaterial(
        @Ctx() { user }: TeacherContext,
        @Arg('data') data: AddMaterialType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<MaterialResponseType> {
        let documentUrl = await uploadFile(data.document);
        let material = await createEntity(Material, {
            ...data,
            fileUrl: documentUrl,
            teacher: { id: user.id },
        });
        if (material.entity && subjects) {
            await saveSubjects(material.entity, 'material_id', material.entity.id, subjects);
        }
        return material;
    }

    @Query(() => [Material])
    @UseMiddleware(TeacherAuthMiddleware)
    async getAllMaterials(@Ctx() { user }: TeacherContext): Promise<Material[] | undefined> {
        let materials = getData(Material, { where: { teacher: { id: user.id } } });
        return materials;
    }

    @Mutation(() => MaterialResponseType)
    @UseMiddleware(TeacherAuthMiddleware)
    async updateMaterial(
        @Arg('materialId') id: number,
        @Arg('data') data: UpdateMaterialType,
        @Arg('subjects', () => [SubStdBoardType], { nullable: true }) subjects: SubStdBoardType[],
    ): Promise<MaterialResponseType> {
        let fileUrl = null;
        if (data.document) {
            fileUrl = await uploadFile(data.document);
        }
        let materialData: Partial<Material> = { ...data };
        if (fileUrl) materialData.fileUrl = fileUrl;
        let material = await updateEntity(Material, id, materialData);
        if (material.entity && subjects) {
            await saveSubjects(material.entity, 'material_id', material.entity.id, subjects);
        }
        return material;
    }

    @Mutation(() => Material)
    @UseMiddleware(TeacherAuthMiddleware)
    async deleteMaterial(@Arg('materialId') materialId: number): Promise<Material | null> {
        return removeEntity(Material, materialId);
    }

    @Query(() => Material)
    @UseMiddleware(TeacherAuthMiddleware)
    async getMaterial(@Arg('materialId') materialId: number): Promise<Material | undefined> {
        let material = await findEntityOrThrow(Material, materialId);
        return material;
    }
}
