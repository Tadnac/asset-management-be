import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { throwError } from '../../utils/responseHelper';
import { signToken } from '../../utils/jwt';
import { GraphQLError } from 'graphql';


interface AuthArgs {
    email: string;
    password: string;
}

export const userResolvers = {
    Mutation: {
        register: async (_parent: unknown, args: AuthArgs) => {
            if (!args.email?.trim() || !args.password){
                throwError('Email and password are required', 'BAD_REQUEST');
            }
             if (args.password.length < 8) {
                throwError('Password must be at least 8 characters', 'BAD_REQUEST');
                  }
            try{
                const existingUser = await prisma.user.findUnique({
                    where: {email: args.email}
                });
                if (existingUser){
                    throwError('User already exists', 'BAD_REQUEST');
                }

                const defaultRole = await prisma.userType.findUnique({
                    where:{name: 'User'}
                });
                
                if(!defaultRole){
                    return throwError('Role not existing. Have to be created first', 'INTERNAL_ERROR');
                }
                    const hashedPassword = await bcrypt.hash(args.password,10);

                    const newUser = await prisma.user.create({
                        data:{
                            email: args.email,
                            password: hashedPassword,
                            userTypeId: defaultRole!.id
                        },
                        include: { userType: true }
                    });
                    const token = signToken(
                        { userId: newUser.id, role: newUser.userType.name }
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
        if (!args.email?.trim() || !args.password) {
            throwError('Email and password are required', 'BAD_REQUEST');
          }
        try{
            const user = await prisma.user.findUnique({
                where:{ email: args.email },
                include: { userType: true }
            });
            if(!user){
                throwError('Bad e-mail or password', 'UNAUTHENTICATED');
            }
            const isValidPassword = await bcrypt.compare(args.password, user!.password);
            if(!isValidPassword){
                return throwError('Bad e-mail or password');
            }
            const token = jwt.sign(
                { userId: user.id, role: user.userType.name },
                process.env.JWT_SECRET as string, {expiresIn: '1d'}
            );
            return {token,user};
        }catch(error){
            return throwError('Login has failed');
        }
    }
}
}
