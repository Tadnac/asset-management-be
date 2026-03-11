export const itemTypeTypeDefs = `#graphql
type ItemType {
id: ID!
name: String!
items: [Item!]
}
extend type Query {
itemTypes: [ItemType!]!
itemType(id: ID!): ItemType
}
extend type Mutation{
createItemType(name: String!): ItemType!
updateItemType(id: ID!, name:String): ItemType!
deleteItemType(id: ID!): ItemType!
}
`;