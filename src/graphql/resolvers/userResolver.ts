import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { throwError } from '../../utils/responseHelper';


const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'super_tajny_klic_pro_asset_management';

export const userResolvers = {
    Mutation: {
        register: async (_parent: unknown, args: any) => {
            try{
                const existingUser = await prisma.user.findUnique({
                    where: {email: args.email}
                });
                if(existingUser){
                    throwError('User already exists');
                }

                const defaultRole = await prisma.userType.findUnique({
                    where:{name: 'User'}
                });
                if(!defaultRole){
                    return throwError('Role not existing. Have to be created first');
                }
                    const hashedPassword = await bcrypt.hash(args.password,10);

                    const newUser = await prisma.user.create({
                        data:{
                            email: args.email,
                            password: hashedPassword,
                            userTypeId: defaultRole.id
                        },
                        include: { userType: true }
                    });
                    const token = jwt.sign(
                        { userId: newUser.id, role: newUser.userType.name },
                        JWT_SECRET, {expiresIn: '1d'}
                    );
                    return {
                        token,
                        user: newUser
                    };
            }catch(error){
                throwError('Registration has failed');
            }
    },
    login: async(_parent: unknown, args: any) => {
        try{
            const user = await prisma.user.findUnique({
                where:{ email: args.email },
                include: { userType: true }
            });
            if(!user){
                return throwError('Bad e-mail or password');
            }
            const isValidPassword = await bcrypt.compare(args.password, user.password);
            if(!isValidPassword){
                return throwError('Bad e-mail or password');
            }
            const token = jwt.sign(
                { userId: user.id, role: user.userType.name },
                JWT_SECRET, {expiresIn: '1d'}
            );
            return {token,user};
        }catch(error){
            return throwError('Login has failed');
        }
    }
}
}