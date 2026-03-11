import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


import { buildingTypeDefs } from './graphql/typeDefs/buildingTypeDefs';
import { buildingResolvers } from './graphql/resolvers/buildingResolver';

import { floorTypeDefs } from './graphql/typeDefs/floorTypeDefs';
import { floorResolvers } from './graphql/resolvers/floorResolver';

import { roomTypeDefs } from './graphql/typeDefs/roomTypeDefs';
import { roomResolvers

 } from './graphql/resolvers/roomResolver';
const server = new ApolloServer({
  typeDefs: [buildingTypeDefs,floorTypeDefs,roomTypeDefs], 
  resolvers: [buildingResolvers,floorResolvers,roomResolvers],
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`GraphQL Server běží na adrese: ${url}`);
};

startServer();
