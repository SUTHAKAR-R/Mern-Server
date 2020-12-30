import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';


import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers/index.js'
import { CONNECTION_URL } from './config.js'

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
})

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        return server.listen({port: PORT})
    })
    .then(response => {
        console.log(`Server started at url ${response.url}`)
    })
    .catch(err => console.log(err))