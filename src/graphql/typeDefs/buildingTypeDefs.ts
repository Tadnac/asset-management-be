export const buildingTypeDefs = `#graphql
  
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
  
  type Mutation {
  createBuilding(name: String!, address: String): Building!
  # delete building by Id
  deleteBuilding(id: ID!) Building!
  }
`;
