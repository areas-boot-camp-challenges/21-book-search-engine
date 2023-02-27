const apiRouter = require("express").Router()
const userRoutes = require("./user-routes")

apiRouter.use("/users", userRoutes)

module.exports = apiRouter
