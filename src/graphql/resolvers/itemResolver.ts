import { PrismaClient } from '@prisma/client';
import { throwError } from '../../utils/responseHelper';

const prisma = new PrismaClient();

export const itemResolvers = {
    Query:{
        items: async () => {
            try{
                return await prisma.item.findMany({
                    include: {
                        type: true,
                        room:{
                            include:{
                                floor:{
                                    include:{
                                        building:true
                                    }
                                }
                            }
                        }
                    }
                });
            }catch(error){
                throwError('Loading items has failed');
            }
        },
        item: async(_parent: unknown, args: {id: string}) => {
            try{
                const item = await prisma.item.findUnique({
                    where: {id: Number(args.id)},
                    include: {
                        type: true,
                        room:{
                            include:{
                                floor:{
                                    include:{
                                        building:true
                                    }
                                }
                            }
                        }
                    }
            });
            return item ? item : throwError('Item not found');
            }catch(error){
                throwError('Loading item failed');
            }
        }
    },
    Mutation:{
        createItem: async(_parent: unknown, args:{
            inventoryNumber: string,
            name: string,
            specifications?: string,
            typeId: number,
            roomId: number
        }) => {
            try{
                return await prisma.item.create({
                    data:{
                        inventoryNumber: args.inventoryNumber,
                        name: args.name,
                        specifications: args.specifications ?? null,
                        typeId: args.typeId,
                        roomId: args.roomId
                    }
                });
            }catch(error){
                throwError('Creating item has failed');
            }
        },
        updateItem: async(_parent: unknown, args:{
            id: string, 
            inventoryNumber?: string, 
            name?: string, 
            specifications?: string, 
            typeId?: number, 
            roomId?: number

        }) => {
            try{
                return await prisma.item.update({
                where: {id: Number(args.id)},
                data: {
            ...(args.inventoryNumber !== undefined && { inventoryNumber: args.inventoryNumber }),
            ...(args.name !== undefined && { name: args.name }),
            ...(args.specifications !== undefined && { specifications: args.specifications }),
            ...(args.typeId !== undefined && { typeId: args.typeId }),
            ...(args.roomId !== undefined && { roomId: args.roomId })
          }
        });
            }catch(error){
                throwError('Update item has failed');
            }
        },
        deleteItem: async(_parent: unknown,args: {id:string}) => {
            try{
                return await prisma.item.delete({
                    where: {id: Number(args.id)}
                });
            }catch{
                throwError('Deleting item has failed');
            }
        }
    }
};