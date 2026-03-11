import { PrismaClient } from '@prisma/client';
import { throwError } from '../../utils/responseHelper';

const prisma = new PrismaClient();

export const itemTypeRsolvers = {

    Query:{
        itemTypes: async() => {
            try{
                return await prisma.itemType.findMany();
            }catch(error){
                throwError('Loading  typeItem has failed');
            }
        },
        itemType: async(_parent: unknown, args:{id:string}) => {
           
           try{

            const itemType = await prisma.itemType.findUnique({
                where: {id: Number(args.id)}
            });
            return itemType ? itemType : throwError('Loading item type has failed');
        }catch(error){
            throwError('Loading  typeItem has failed')
        }
        }
    },
    Mutation: {
    
    createItemType: async (_parent: unknown, args: { name: string }) => {
      try {
        const newItemType = await prisma.itemType.create({
          data: {
            name: args.name
          }
        });
        return newItemType;
      } catch (error) {
        throwError('Creating item type failed', 'INTERNAL_ERROR');
      }
    },
    
    updateItemType: async (_parent: unknown, args: { id: string, name?: string }) => {
      try {
        const updatedItemType = await prisma.itemType.update({
          where: { id: Number(args.id) },
          data: {
            ...(args.name !== undefined && {name: args.name})
          }
        });
        return updatedItemType;
      } catch (error) {
        throwError('Updating item type failed', 'INTERNAL_ERROR');
      }
    },

    deleteItemType: async (_parent: unknown, args: { id: string }) => {
      try {
        const deletedItemType = await prisma.itemType.delete({
          where: { id: Number(args.id) }
        });
        return deletedItemType;
      } catch (error) {
        throwError('Deleting item type failed', 'INTERNAL_ERROR');
      }
    }
  }
};
