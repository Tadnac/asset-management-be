export const floorTypeDefs = `#graphql
type Floor{
id: ID!
levelNumber: Int!
name: String
buildingId: Int!
}

extend type Query{
floors: [Floor!]!
floor(id: ID!): Floor
}

extend type Mutation {
createFloor(levelNumber: Int!, name: String, buildingId: Int!): Floor!
deleteFloor(id: ID!): Floor!
}
`;
