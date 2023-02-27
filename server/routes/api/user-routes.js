// Dependencies.
const userRouter = require("express").Router()

// Middleware.
const {
  authMiddleware
} = require("../../utils/auth")

// Controllers.
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require("../../controllers/user-controller")

// User routes.
userRouter
  .post("/", createUser)

userRouter
  .get("/me", authMiddleware, getSingleUser)

userRouter
  .post("/login", login)

// Books routes.
userRouter
  .put("/", authMiddleware, saveBook)

userRouter
  .delete("/books/:bookId", authMiddleware, deleteBook)

module.exports = userRouter
