import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendError } from '../utils/responseHelper';

const router = Router();
const prisma = new PrismaClient();
// get rooms by floor id or name
router.get('/', async(req,res) => {
  const {floorId, name} = req.query;
  try{
    const rooms = await prisma.findMany({
      where:{
        floorId: floorId ? Number(floorId) : undefined,
        name: name ? {contains: string(name)} : undefined
      }
    });
    res.json(rooms);
  }catch(Error){
    return sendError(500,'Loading failed');
  }
});

// room detail 
outer.get('/:id', async(req,res) => {
  const {floorId, name} = req.params;
  try{
    const room = await prisma.findUnique({
      where: {id: Number(id)},
      include: {
        items: {
          include: {type: true}
        }
      }
    });
    res.json(room);
    if(!room){
        return sendError(res,404,'Room not found');
        }
        res.json(building)
  }catch(Error){
    return sendError(500,'Loading failed');
  }
});
export default router;
