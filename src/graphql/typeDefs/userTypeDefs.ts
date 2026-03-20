export const userTypeDefs  = `#graphql
type UserType {
id: ID!
name: String!
}

type User {
id: ID!
email: String!
userType: UserType!
}
type AuthPayLoad {
token: String!
user: User!
}

extend type Mutation {
register(email: String!, password: String!): AuthPayLoad!

login(email: String!, password: String!): AuthPayLoad!
}
`;