import express from 'express';
import bodyParser from 'body-parser';
import graphql, { graphqlHTTP } from 'express-graphql';
// import { buildSchema } from 'graphql';

import { title } from 'process';
import mongoose from 'mongoose';

import { bookingSchema } from './graphql/schema';
import { graphqlresolvers } from './graphql/resolvers';

const app = express();



app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema:  bookingSchema,
    rootValue: graphqlresolvers,
    graphiql: true
})); //you can use api

app.get('/', (req, res) => {
    res.send('Hello');
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@devcluster.kalhi.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5000, () => console.log("Server running..."));

    }).catch(err => {
        console.log(err);
    })

