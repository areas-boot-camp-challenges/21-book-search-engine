// Dependencies.
const express = require("express")
const path = require("path")

// Database.
const db = require("./config/connection")

// Routes.
const routes = require("./routes")

// Server.
const app = express()
const PORT = process.env.PORT || 3001

// Middleware.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// If production, serve `client/build` as static assets.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")))
}

// Set up the routes.
app.use(routes)

// Start the server.
db.once("open", () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`))
})
