import { Router } from 'express';
import { PrismaClient} from '@prisma/client';
import { senError} from '../utils/responseHelper';

const router = Router();
const prisma = new Prisma();

// loaading building floors
router.get('/', async(req, res) => {
  const {buildingId} = req.query;
  try{
    const floors = await prisma.floor.findMany({
      where:{
            buildingId: buildingId ? number(buildingId) : undefined
            }
      });
    res.json(floors);
  }catch(Error){
    return sendError(500,'Loading floors failed');
  }
});
// loading specific floor
router.get('/:id', async(req, res) => {
  const {buildingId} = req.query;
  try{
    const floor = await prisma.floor.findUnique({
      where:{ id: Number{id} },
      includes: {rooms: true}
      });
    if{!floor}{
    return SendError(404,'Floor not found');
    }
    res.json(floor);
  }catch(Error){
    return sendError(500,'Loading floors failed');
  }
});
