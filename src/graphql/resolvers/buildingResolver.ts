import { PrismaClient } from '@prisma/client';
import { throwError } from '../../utils/responseHelper';

const prisma = new PrismaClient();

export const buildingResolvers = {
  Query: {
    
    buildings: async () => {
      try {
        
        return await prisma.building.findMany({
          include: { floors: true }
        });
      } catch (error) {
        throw new Error('Loading buildings failed');
      }
    },

    building: async (_parent: unknown, args: {id: string}) => {
      try {
        const building = await prisma.building.findUnique({
          where: { id: Number(args.id) }, 
          include: { floors: true }
        });
        
        if (!building) {
          throwError('Building not found', 'NOT_FOUND');
        }
        
        return building;
      } catch (error) {
        throwError('Building not found', 'NOT_FOUND');
      }
    }
  },
  Mutation: {
    createBuilding: async(_parent: unknown, args: {name: string, address?: string}) => {
      try{
        const newBuilding = await prisma.building.create({
          data: {
            name: args.name,
            address: args.address
          }
        });
        return newBuilding;
      }catch(error){
        throwError('Creating building failed');
      }
    },
     deleteBuilding: async (_parent: unknown, args: {id: number}) => {
    try{
        const deletedBuilding = await prisma.building.delete({
          where: {
            id: Number(args.id)
          }
        });
        return deletedBuilding;
    }catch(error){
      throwError('Deleting failed');
    }
  }
  }
};
