import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { requireRole, Context, requireAuth } from '../../utils/authHelper';
import { parseId } from '../../utils/validation';
import {handleError} from '../../utils/errors';
import { Roles } from '../../utils/roles';

export const buildingResolvers = {
  Query: {
    
    buildings: async (_parent:unknown, _args:unknown, context: Context) => {
      requireAuth(context);
      try {
        
        return await prisma.building.findMany({
          include: { floors: true }
        });
      } catch (error) {
        handleError(error,'Loading buildings failed');
      }
    },

    building: async (_parent: unknown, args: {id: string}, context: Context) => {
      requireAuth(context);
      const buildingId = parseId(args.id,'building id');
      try {
        const building = await prisma.building.findUnique({
          where: { id: buildingId }, 
          include: { floors: true }
        });
        
        if (!building) {
          throwError('Building not found', 'NOT_FOUND');
        }
        
        return building;
      } catch (error) {
        handleError(error, 'Loading building failed');
      }
    }
  },
  Mutation: {
    createBuilding: async(_parent: unknown, args: {name: string, address?: string }, context: Context) => {
      requireRole(context, Roles.ADMIN);
      const name = args.name.trim();
      if(!name)
      {
        throwError("Building name is required", 'BAD_REQUEST');
      }
      try{
        const newBuilding = await prisma.building.create({
          data: {
            name: name,
            address: args.address ?? null
          }
        });
        return newBuilding;
      }catch(error){
        handleError(error,'Creating building failed');
      }
    },
     deleteBuilding: async (_parent: unknown, args: {id: string}, context: Context) => {
      requireRole(context, Roles.ADMIN);
      const buildingId = parseId(args.id, 'building id');
      try{
        const deletedBuilding = await prisma.building.delete({
          where: {
            id: buildingId
          }
        });
        return deletedBuilding;
    }catch(error){
      handleError(error,'Deleting building failed');
    }
  }
  }
};
