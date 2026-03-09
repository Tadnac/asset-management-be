export const floorTypeDefs = `#graphql
type Floor{
id: ID!
levelNumber: Int!
number: string
buildingId: Int!
}

extend type Query{
floors: [Floor!]!
floor: (id: ID!): Floor
}

extend type Mutation {
createFloor(levelNumber: Int!, name: string, buildingId: Int!): Floor!
deleteFloor(id: ID!): Floor!
}
`;
