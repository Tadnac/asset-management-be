export const buildingTypeDefs = `#graphql
  
  type Building {
    id: ID!
    name: String!
    address: String
    img: String
    floors: [Floor!]! 
  }

  type Query {
    buildings: [Building!]!         
    building(id: ID!): Building 
  }
  
  type Mutation {
  createBuilding(name: String!, address: String): Building!
  # delete building by Id
  deleteBuilding(id: ID!): Building!
  }
`;
