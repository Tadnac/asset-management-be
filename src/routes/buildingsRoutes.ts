import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendError } from '../utils/responseHelper';

const router = Router();
const prisma = new PrismaClient();

 // fetch all buildings for basic basic card display
router.get('/',async (req, res) => {
    try{
        // loading by prisma by prisma.findMany method
        const buildings = await prisma.building.findMany();
        res.json(buildings);
    }catch($e){
        return sendError(res,500,'Loading building failed');
    }
       
});

// fetching single building object
 router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const building = await prisma.building.findUnique({
            where: {id: Number(id)},
            // use include for 'children' items like floors
            include: {floors: true} 
        });
        if(!building){
        return sendError(res,404,'Building not found');
        }
        res.json(building)
        }catch(error){
            return sendError(res,500,'Loading building failed');
        }      
 });

 export default router;