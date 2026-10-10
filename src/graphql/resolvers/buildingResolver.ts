import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { requireRole, Context } from '../../utils/authHelper';
import { parseId } from '../../utils/validation';

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
        const buildingId = parseId(args.id, 'building id');
        const building = await prisma.building.findUnique({
          where: { id: buildingId }, 
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
    createBuilding: async(_parent: unknown, args: {name: string, address?: string }, context: Context) => {
      requireRole(context, 'ADMIN');
      try{
        const newBuilding = await prisma.building.create({
          data: {
            name: args.name,
            address: args.address ?? null
          }
        });
        return newBuilding;
      }catch(error){
        throwError('Creating building failed');
      }
    },
     deleteBuilding: async (_parent: unknown, args: {id: string}, context: Context) => {
      requireRole(context,'ADMIN');
      const buildingId = parseId(args.id, 'buildingId');
      try{
        const deletedBuilding = await prisma.building.delete({
          where: {
            id: Number(buildingId)
          }
        });
        return deletedBuilding;
    }catch(error){
      throwError('Deleting failed');
    }
  }
  }
};
