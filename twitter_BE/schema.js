const { gql } = require('apollo-server-express');
const data = require('./data.json');
const jwt = require("jsonwebtoken");
const authConfig = require('./Configs/auth.config.js');

const typeDefs = gql`
  type Tweet {
    id: ID!
    body: String
    date: Date
    Author: User
    Stats: Stat
  }

  type User {
    id: ID!
    email: String
    password: String
    username: String
    first_name: String
    last_name: String
    avatar_url: Url
  }

  type Stat {
    views: Int
    likes: Int
    retweets: Int
    responses: Int
  }

  type Notification {
    id: ID
    date: Date
    type: String
  }

  scalar Url
  scalar Date

  type Meta {
    count: Int
  }

  type AuthPayload {
    token: String
  }

  type Query {
    Tweet(id: ID!): Tweet
    Tweets(limit: Int, skip: Int, sort_field: String, sort_order: String): [Tweet]
    TweetsMeta: Meta
    User: User
    Users: [User]
    Notifications(limit: Int): [Notification]
    NotificationsMeta: Meta
  }

  type Mutation {
    createTweet(body: String): Tweet
    deleteTweet(id: ID!): Tweet
    markTweetRead(id: ID!): Boolean
    login(email: String!, password: String!): AuthPayload
  }
`;

const resolvers = {
  Query: {
    Tweet: (parent, { id }) => {
      return data.tweets.find((tweet) => tweet.id === id);
    },
    Tweets: (parent, { limit, skip, sort_field, sort_order }, context) => {
      const { userId } = context;
      let tweets = data.tweets.filter(tweet=> tweet.authorId==userId);

      if (sort_field && sort_order) {
        tweets = tweets.sort((a, b) => {
          const fieldA = a[sort_field];
          const fieldB = b[sort_field];

          if (fieldA < fieldB) {
            return sort_order === 'asc' ? -1 : 1;
          }
          if (fieldA > fieldB) {
            return sort_order === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      if (limit) {
        tweets = tweets.slice(skip || 0, skip || 0 + limit);
      }
      return tweets;
    },
    TweetsMeta: () => {
      return { count: data.tweets.length };
    },
    User: (parent, args, context) => {
      const { userId } = context;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const user = data.users.find((user) => user.id === userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    },
    Users: () => {
      return data.users;
    },
    Notifications: (parent, { limit }) => {
      let notifications = data.notifications;

      if (limit) {
        notifications = notifications.slice(0, limit);
      }

      return notifications;
    },
    NotificationsMeta: () => {
      return { count: data.notifications.length };
    },
  },
  Tweet: {
    Author: (tweet) => {
      return data.users.find((user) => user.id === tweet.authorId);
    },
    Stats: (tweet) => {
      return tweet.stats;
    },
  },
  Mutation: {
    createTweet: (parent, { body }, context) => {
      const { userId } = context;
      const newTweet = {
        id: String(data.tweets.length + 1),
        body,
        date: new Date().toISOString(),
        authorId: userId,
        stats: {
          views: 0,
          likes: 0,
          retweets: 0,
          responses: 0
        }
      };

      data.tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet: (parent, { id }) => {
      const index = data.tweets.findIndex((tweet) => tweet.id === id);
      if (index !== -1) {
        const deletedTweet = data.tweets.splice(index, 1)[0];
        return deletedTweet;
      }
    
      return null;
    },
    
    markTweetRead: (parent, { id }) => {
      return true;
    },

    login: async (parent, { email, password }) => {
      const user = data.users.find(user => user.email === email);

      if (!user) {
        throw new Error('User not found');
      }

      if (password !== user.password) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.id }, authConfig.secert, { expiresIn: 600 });

      return { token };
    }
  },
};


module.exports = { typeDefs, resolvers };