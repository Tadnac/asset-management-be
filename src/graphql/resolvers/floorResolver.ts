import { PrismaClient } from '@prisma/client';
import { throwError } from '../../utils/responseHelper';

const prisma = new PrismaClient();
export const floorResolvers = {
  
      Query: {
        floors: async () => {
          try {
            return await prisma.floor.findMany({
              include: {building: true}
            });
          } catch(error) {
            throwError('Loading floors failed');
          }
        },
        floor: async (_parent: unknown, args: {id: string}) => {
           try {
            const floor =  await prisma.floor.findUnique({
              where: {id: Number(args.id)},
              include: {building: true}
            });
             if(!floor){
               throwError('Floor not found', 'NOT_FOUND');
             }
             return floor;
          } catch(error) {
            throwError('Loading floors failed');
          }
        } 
      },
      Mutation: {
         createFloor: async (_parent: unknown, args: {levelNumber: number, name?: string, buildingId: number}) => {
           try {
            const newFloor = await prisma.floor.create({
              data: {
                levelNumber: args.levelNumber,
                name: args.name,
                buildingId: args.buildingId
              }
            });
             return newFloor;
          } catch(error) {
            throwError('Creating floor failed');
          }
        },
         deleteFloor: async (_parent: unknown, args: {id: string}) => {
           try {
            const deletedFloor = await prisma.floor.delete({
              where: {id: Number(args.id)}
            });
             return deletedFloor;
          } catch(error) {
            throwError('Deleting floor failed');
          }
        }
    }
};
