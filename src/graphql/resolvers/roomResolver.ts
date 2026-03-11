import { PrismaClient } from '@prisma/client';
import { throwError } from '../../utils/responseHelper';

const prisma = new PrismaClient();

export const roomResolvers = {
    Query:{
        rooms: async() => {
            try{
                return await prisma.room.findMany({
                    include: {floor:true}
                });
            }catch(error){
                return throwError('Loading rooms has failed');
            }
        },
        room: async(_parent: unknown, args:{id: number}) => {
            try{
            const room = await prisma.room.findUnique({
                where:{id: Number(args.id)},
                include:{floor:true}
            });
            return room ? room :  throwError('Room not found', 'NOT_FOUND');;
        }catch(error){
            return throwError('Loading room has failed');
        }
    }
    },
    Mutation:{
        createRoom: async(_parent: unknown, args:{name: string, description: string, floorId: number}) =>{
            try{
            const newRoom = await prisma.room.create({
                data:{
                    name: args.name,
                    description: args.description,
                    floorId: args.floorId
                }
            });
            return newRoom;
        }catch(error){
            throwError('Creating room has failed');
        }
    },
    deleteRoom: async(_parent: unknown, args: {id: string}) => {
        try{
            const deletedRoom = await prisma.room.delete({
                where:{id: Number(args.id)}
            });
            return deletedRoom;
        }catch{
            throwError('Deleting room has failed');
        }
    }
}
}