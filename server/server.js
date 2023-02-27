// Dependencies.
const express = require("express")
const { ApolloServer } = require("apollo-server-express")
const path = require("path")

// Database and schema.
const { typeDefs, resolvers } = require("./schemas")
const db = require("./config/connection")

// Server.
const app = express()
const PORT = process.env.PORT || 3001
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Routes.
const routes = require("./routes")

// Middleware.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// If production, serve `client/build` as static assets.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))
}

// Set up the server.
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start()
  server.applyMiddleware({ app })
  // Connect to the database and console log the details.
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server listening on localhost:${PORT}! 🚀`)
      console.log(`GraphQL at http://localhost:${PORT}${server.graphqlPath} 🤓`)
    })
  })
}

// Start the server.
startApolloServer(typeDefs, resolvers)
