import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendError } from '../utils/responseHelper';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async(req,res) => {

  const {roomId,inventoryNumber} = req.query;
  try {
        const item = await prisma.item.findUnique({
            where: { id: Number(id) },
            include: { 
                type: true,
                room: {
                    include: { floor: true } // U detailu chceme vědět i v jakém patře ta místnost je
                },
                photos: true 
            }
        });
    if (!item){
      return sendError(404,'Item not found');
    }
      res.json(item);
  }catch(Error){
   return sendError(500,'Loading failed');
  }
  });
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const item = await prisma.item.findUnique({
            where: { id: Number(id) },
            include: { 
                type: true,
                room: true
            }
        });
        
        if (!item) {
            return sendError(res, 404, 'Item not found');
        }
        res.json(item);
    } catch (error) {
        return sendError(res, 500, 'Loading item failed');
    }
});

