import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


import { buildingTypeDefs } from './graphql/typeDefs/buildingTypeDefs';
import { buildingResolvers } from './graphql/resolvers/buildingResolver';

import { floorTypeDefs } from './graphql/typeDefs/floorTypeDefs';
import { floorResolvers } from './graphql/resolvers/floorResolver';

import { roomTypeDefs } from './graphql/typeDefs/roomTypeDefs';
import { roomResolvers } from './graphql/resolvers/roomResolver';

import { itemTypeResolvers } from './graphql/resolvers/itemTypeResolver';
import { itemTypeTypeDefs } from './graphql/typeDefs/itemTypeTypeDefs';

import { itemResolvers } from './graphql/resolvers/itemResolver';
import { itemTypeDefs } from './graphql/typeDefs/itemTypeDefs';

import { userTypeDefs } from './graphql/typeDefs/userTypeDefs';
import { userResolvers } from  './graphql/resolvers/userResolver';

import { verifyToken } from './utils/jwt';
import { Context } from './utils/authHelper';

const server = new ApolloServer({
  typeDefs: [buildingTypeDefs,floorTypeDefs,roomTypeDefs,itemTypeTypeDefs,itemTypeDefs, userTypeDefs], 
  resolvers: [buildingResolvers,floorResolvers,roomResolvers,itemTypeResolvers,itemResolvers, userResolvers],
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }): Promis<Context> => {
      const authHeader = req.headers. authorization ?? '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

      if (!token){
        return {user: null};
      }
      const payload = verifyToken(token);
      if (!payload) {
        return { user: null };
      }
      return { user: { id: payload.id, role: payload.role } };
    },
  });
  console.log(`GraphQL Server běží na adrese: ${url}`);
};

startServer();
