import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { requireAuth,requireRole, Context } from '../../utils/authHelper';
import { parseId } from '../../utils/validation';
import { handleError } from '../../utils/errors';



export const floorResolvers = {
  
      Query: {
        floors: async (_parent: unknown, _args: unknown, context: Context) => {
          requireAuth(context);
          try {
            return await prisma.floor.findMany({
              include: {building: true}
            });
          } catch(error) {
            handleError(error,'Loading floors failed');
          }
        },
        floor: async (_parent: unknown, args: {id: string}, context:Context) => {
          requireAuth(context);
          const floorId = parseId(args.id, 'floor id');
           try {
            const floor =  await prisma.floor.findUnique({
              where: {id: floorId},
              include: {building: true}
            });
             if(!floor){
                throwError('Floor not found', 'NOT_FOUND');
             }
             return floor;
          } catch(error) {
            handleError(error, 'Loading floor failed');
          }
        } 
      },
      Mutation: {
         createFloor: async (_parent: unknown, args: {levelNumber: number, name?: string, buildingId: number}, context: Context) => {
          requireRole(context, 'ADMIN');
          try {
            // check ze dana budova existuje aby mi to nechciplo na neexistujici budove
            const building = await prisma.building.findUnique({
              where: {id: args.buildingId},
              select: {id: true},
            });
            if (!building){
              throwError('Building not found', 'NOT_FOUND');
            }
            const newFloor = await prisma.floor.create({
              data: {
                levelNumber: args.levelNumber,
                name: args.name?.trim() || null,
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
          const floorId = parseId(args.id, 'floor id');
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
