// src/graphql/resolvers/userResolver.ts
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { prisma } from '../../lib/prisma';
import { throwError } from '../../utils/responseHelper';
import { signToken } from '../../utils/jwt';

interface AuthArgs {
  email: string;
  password: string;
}

export const userResolvers = {
  Mutation: {
    register: async (_parent: unknown, args: AuthArgs) => {
      if (!args.email?.trim() || !args.password) {
        throwError('Email and password are required', 'BAD_REQUEST');
      }
      if (args.password.length < 8) {
        throwError('Password must be at least 8 characters', 'BAD_REQUEST');
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: args.email }
        });
        if (existingUser) {
          throwError('User already exists', 'BAD_REQUEST');
        }

        const defaultRole = await prisma.userType.findUnique({
          where: { name: 'User' }
        });
        if (!defaultRole) {
          throwError('Role not existing. Has to be created first', 'INTERNAL_ERROR');
        }

        const hashedPassword = await bcrypt.hash(args.password, 10);
        const newUser = await prisma.user.create({
          data: {
            email: args.email,
            password: hashedPassword,
            userTypeId: defaultRole!.id
          },
          include: { userType: true }
        });

        const token = signToken({ id: newUser.id, role: newUser.userType.name });
        const { password: _password, ...safeUser } = newUser;

        return { token, user: safeUser };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Registration failed:', error);
        throwError('Registration has failed', 'INTERNAL_ERROR');
      }
    },

    login: async (_parent: unknown, args: AuthArgs) => {
      if (!args.email?.trim() || !args.password) {
        throwError('Email and password are required', 'BAD_REQUEST');
      }

      try {
        const user = await prisma.user.findUnique({
          where: { email: args.email },
          include: { userType: true }
        });
        if (!user) {
          throwError('Bad e-mail or password', 'UNAUTHENTICATED');
        }

        const isValidPassword = await bcrypt.compare(args.password, user!.password);
        if (!isValidPassword) {
          throwError('Bad e-mail or password', 'UNAUTHENTICATED');
        }

        const token = signToken({ id: user!.id, role: user!.userType.name });
        const { password: _password, ...safeUser } = user!;

        return { token, user: safeUser };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }
        console.error('Login failed:', error);
        throwError('Login has failed', 'INTERNAL_ERROR');
      }
    }
  }
};
