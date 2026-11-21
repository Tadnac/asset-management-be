import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { requireAuth, requireRole, Context} from '../../utils/authHelper';
import { parseId } from '../../utils/validation';
import { handleError } from '../../utils/errors';
import { Roles } from '../../utils/roles';

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
                where:{id: roomId},
                include:{floor:true}
            });
            if(!room){
                return throwError('Room not found', 'NOT_FOUND');
            }
            return room;
        }catch(error){
            return handleError(error,'Loading room has failed');
        }
    }
    },
    Mutation:{
        createRoom: async(_parent: unknown, args:{name: string, description?: string, floorId: string}, context: Context) =>{
            requireRole(context,Roles.ADMIN);
            const floorId = parseId(args.floorId,'floor Id');
            const name = args.name.trim();
            if(!name){
                return throwError('Name is empty', 'BAD_REQUEST');
            }           
            try{
                 const floor = await prisma.floor.findUnique({
                where:{id: floorId}});
                if(!floor){
                    return throwError('Floor do no exists', 'NOT_FOUND');
                }
            const newRoom = await prisma.room.create({
                data:{
                    name: name,
                    description: args.name?.trim() || null,
                    floorId: floorId
                }
            });
            return newRoom;
        }catch(error){
            handleError(error,'Creating room has failed');
        }
    },
    deleteRoom: async(_parent: unknown, args: {id: string}, context: Context) => {
        requireRole(context,Roles.ADMIN);
        const roomId = parseId(args.id, 'room id');
        
        try{
            const deletedRoom = await prisma.room.delete({
                where:{id:roomId}
            });
            return deletedRoom;
        }catch(error){
             handleError(error,'Deleting room has failed');
        }
    }
}
}