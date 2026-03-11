import { PrismaClient } from '@prisma/client';
import { throwError } from '../../utils/responseHelper';

const prisma = new PrismaClient();

export const itemResolvers = {
    Query:{
        items: async () => {
            try{
                return await prisma.item.findMany();
            }catch(error){
                throwError('Loading items has failed');
            }
        },
        item: async(_parent: unknown, args: {id: string}) => {
            const item = await prisma.item.findUnique({
                where: {id: Number(args.id)}
            });
            return item ? item : throwError('');
        }
    }
}