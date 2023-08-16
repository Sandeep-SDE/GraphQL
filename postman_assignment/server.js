const { ApolloServer, gql } = require("apollo-server");
const {Query}=require("./resolvers/Coin")
const {typeDefs} = require("./schema")

const server = new ApolloServer({
  typeDefs,
  resolvers:{
    Query
  },
  
});

server.listen().then(({ url }) => {
  console.log("server is started at " + url);
});
