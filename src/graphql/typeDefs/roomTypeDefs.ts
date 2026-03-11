export const roomTypeDefs = `#graphql
type Room{
id: ID!
name: String!
description: String,
floorId: Int!
floor: Floor!
}

extend type Query{
rooms: [Room!]!
room(id: ID!): Room
}

extend type Mutation {
createRoom(name: String!, description: String, floorId: Int!): Room!
deleteRoom(id: ID!): Room!
}
`