import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


import { buildingTypeDefs } from './graphql/typeDefs/buildingTypeDefs';
import { buildingResolvers } from './graphql/resolvers/buildingResolver';


const server = new ApolloServer({
  typeDefs: [buildingTypeDefs], 
  resolvers: [buildingResolvers],
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀 GraphQL Server běží úhledně na adrese: ${url}`);
};

startServer();