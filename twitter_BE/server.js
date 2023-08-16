const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors'); // Import the cors package
const { typeDefs, resolvers } = require('./schema');
const authConfig = require('./Configs/auth.config.js');
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());

app.use((req, res, next) => {
    const authHeader = req.headers['x-access-token'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, authConfig.secert);
            req.userId = decodedToken.userId;
        } catch (error) {
            console.log(error);
        }
    }

    next();
});

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({
            userId: req.userId,
        }),
    });

    await server.start();

    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () => {
        console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    });
}

startApolloServer().catch((err) => {
    console.error(err);
});
