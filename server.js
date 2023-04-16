const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs : typeDefs,
  resolvers : resolvers,
  context : ({ req }) => ({ req }),
  cache : "bounded" 
});

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
  console.log('successfuly connected to the Database!');
  return server.listen({ port : 5000 })
})
.then(res => {
  console.log(`server running at ${res.url}`);
})
.catch((err) => {
  console.log(err);
});