export const itemTypeDefs = `#graphql
  type Item {
    id: ID!
    inventoryNumber: String!
    name: String!
    specifications: String
    typeId: Int!
    roomId: Int!
    room: Room
    type: ItemType
  }

  extend type Query {
    items: [Item!]!
    item(id: ID!): Item
  }

  extend type Mutation {
   
    createItem(
      inventoryNumber: String!, 
      name: String!, 
      specifications: String, 
      typeId: Int!, 
      roomId: Int!
    ): Item!

   
    updateItem(
      id: ID!, 
      inventoryNumber: String, 
      name: String, 
      specifications: String, 
      typeId: Int, 
      roomId: Int
    ): Item!

    deleteItem(id: ID!): Item!
  }
`;