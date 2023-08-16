const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const { createTestClient } = require('apollo-server-testing');

const server = new ApolloServer({ typeDefs, resolvers });
const { query, mutate } = createTestClient(server);

describe('GraphQL Schema', () => {
  test('Fetch a single tweet', async () => {
    const { data } = await query({
      query: `
        query {
          Tweet(id: "1") {
            id
            body
          }
        }
      `,
    });

    expect(data.Tweet.id).toEqual('1');
    expect(data.Tweet.body).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit. #LoremIpsum #Tweet');
  });

  test('Create a new tweet', async () => {
    const context = { userId: '1' };

    const { data } = await mutate({
      mutation: `
        mutation {
          createTweet(body: "Hello, world!") {
            id
            body
          }
        }
      `,
      context,
    });

    expect(data.createTweet.body).toEqual('Hello, world!');
  });

  test('Delete a tweet', async () => {
    const context = { userId: '1' };

    const { data } = await mutate({
      mutation: `
        mutation {
          deleteTweet(id: "2") {
            id
          }
        }
      `,
      context,
    });

    expect(data.deleteTweet.id).toEqual('2');
  });
});
