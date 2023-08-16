const { gql } = require("apollo-server");

exports.typeDefs = gql`
scalar JSON

type Query {
  coins(currency: String, skip: Int, limit: Int): JSON
  coinAvg(name: String!, currency: String!): JSON
  coinChart(period: String!, coinId: String!): JSON
}
`;
