import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { requireRole, Context } from '../../utils/authHelper';
import { parseId } from '../../utils/validation';
import { handleError } from '../../utils/errors';
import { error } from 'node:console';



export const floorResolvers = {
  
      Query: {
        floors: async () => {
          try {
            return await prisma.floor.findMany({
              include: {building: true}
            });
          } catch(error) {
            handleError(error,'Loading floors failed');
          }
        },
        floor: async (_parent: unknown, args: {id: string}) => {
          const floorId = parseId(args.id, 'floor Id');
           try {
            const floor =  await prisma.floor.findUnique({
              where: {id: floorId},
              include: {building: true}
            });
             if(!floor){
               handleError(error, 'Floor not found');
             }
             return floor;
          } catch(error) {
            handleError(error, 'Loading floors failed');
          }
        } 
      },
      Mutation: {
         createFloor: async (_parent: unknown, args: {levelNumber: number, name?: string, buildingId: number}, context: Context) => {
          requireRole(context, 'ADMIN');
          try {
            const newFloor = await prisma.floor.create({
              data: {
                levelNumber: args.levelNumber,
                name: args.name ?? null,
                buildingId: args.buildingId
              }
            });
             return newFloor;
          } catch(error) {
            handleError(error, 'Creating floor failed');
          }
        },
         deleteFloor: async (_parent: unknown, args: {id: string}, context: Context) => {
          requireRole(context,'ADMIN');
          const floorId = parseId(args.id, 'floor Id')
           try {
            const deletedFloor = await prisma.floor.delete({
              where: {id:floorId}
            });
             return deletedFloor;
          } catch(error) {
            handleError(error,'Deleting floor failed');
          }
        }
    }
};
