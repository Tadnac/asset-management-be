import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import { throwError } from '../utils/responseHelper';

const prisma = new PrismaClient();


const typeDefs = `#graphql
  
  type Floor {
    id: ID!
    levelNumber: Int!
    name: String
    buildingId: Int!
  }

 
  type Building {
    id: ID!
    name: String!
    address: String
    img: String
    floors: [Floor!]! # Propojení na patra
  }

  
  type Query {
    buildings: [Building!]!         
    building(id: ID!): Building 
  }
`;


const resolvers = {
  Query: {
    
    buildings: async () => {
      try {
        
        return await prisma.building.findMany({
          include: { floors: true }
        });
      } catch (error) {
        throw new Error('Loading buildings failed');
      }
    },

    
    building: async (_parent: unknown, args: {id: string}) => {
      try {
        const building = await prisma.building.findUnique({
          where: { id: Number(args.id) }, 
          include: { floors: true }
        });
        
        if (!building) {
          throwError('Building not found', 'NOT_FOUND');
        }
        
        return building;
      } catch (error) {
        throwError('Building not found', 'NOT_FOUND');
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Tato funkce server nastartuje
const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`GraphQL Server běží na adrese: ${url}`);
};

startServer();