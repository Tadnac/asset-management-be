import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { Context } from '../../utils/authHelper';
import { requireAuth} from '../../utils/authHelper';
import { requireRole } from '../../utils/authHelper';
import { parseId } from '../../utils/validation';
import { handleError } from '../../utils/errors';


export const roomResolvers = {
    Query:{
        rooms: async(_parent: unknown, _args: unknown, context:Context) => {
            requireAuth(context);
            try{
                return await prisma.room.findMany({
                    include: {floor:true}
                });
            }catch(error){
                return handleError(error,'Loading rooms has failed');
            }
        },
        room: async(_parent: unknown, args:{id: string}, context: Context) => {
            requireAuth(context);
            const roomId = parseId(args.id, 'room id');
            try{
            const room = await prisma.room.findUnique({
                where:{id: Number(roomId)},
                include:{floor:true}
            });
            if(!room){
                return throwError('Room not found', 'NOT_FOUND');
            }
        }catch(error){
            return handleError(error,'Loading room has failed');
        }
    }
    },
    Mutation:{
        createRoom: async(_parent: unknown, args:{name: string, description: string, floorId: number}, context: Context) =>{
            requireRole(context,'Admin');
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
            handleError(error,'Creating room has failed');
        }
    },
    deleteRoom: async(_parent: unknown, args: {id: string}, context: Context) => {
        requireRole(context,'Admin');
        parseId(args.id, 'room id');
        try{
            const deletedRoom = await prisma.room.delete({
                where:{id: Number(args.id)}
            });
            return deletedRoom;
        }catch(error){
             handleError(error,'Deleting room has failed');
        }
    }
}
}