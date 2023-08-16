const { gql } = require('apollo-server-express');

const jsonData = require("./data.json");


const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    publicationDate: String!
  }

  type Weather{
    temperature: Float!,
    humidity: Int!,
    description: String!
  }

  type Imdb{
    title: String!,
    releaseYear: Int!,
    rating: Float!,
    director: String!
  }

  type Data{
    firstName: String!
    lastName: String!
  }

  type Query {
    book(id: ID!): Book
    data: [Data!]
    weather: [Weather]
    regionalWeather(id:ID!): Weather
    movies: [Imdb]
    movie(id: ID!): Imdb
  }

`;

const bookData = [
  {
    id: '123',
    title: 'The Awakening',
    author: 'Kate Chopin',
    publicationDate: '1899',
  },
];

const userName = [
  {
    firstName: "Dp",
    lastName: "Deekshitha"
  },
  {
    firstName: "Mudigonda",
    lastName: "Sandeep"
  }
];

const resolvers = {
  Query: {
    book: (parent, { id }) => {

      return bookData.find(book => book.id === id)

    },

    data: () => userName,

    weather: () => {
      return jsonData.weather;
    },
    regionalWeather: (parent, { id }) => {

      return jsonData.weather[id];
    },
    movies: () => {
      return jsonData.demoImdbData;
    },
    movie: (parent, { id }) => {

      return jsonData.demoImdbData[id]

    },

  },
};

module.exports = { typeDefs, resolvers };
