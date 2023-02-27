// Dependencies.
const jwt = require("jsonwebtoken")
require("dotenv").config()

// JWT token secret and expiration.
const secret = process.env.JWT_SECRET
const expiration = process.env.JWT_EXPIRATION

async function authMiddleware(req, res, next) {
  try {
    // Get the token from the query param or header.
    let token = req.query.token || req.headers.authorization
    // If the token’s from the header, split and pop it (remove “Bearer”), and trim any whitespace.
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim()
    }
    // If there’s no token, return an error.
    if (!token) {
      return res.status(401).json("You must submit a token.")
    }
    // Verify the token.
    const { data } = jwt.verify(
      token,
      secret,
      { maxAge: expiration }
    )
    // Pass the user data to the next step.
    req.user = data
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json("Sorry, something went wrong.")
  }
}

function signToken({ _id, username, email }) {
  // Sign the token.
  return jwt.sign(
    { data: { _id, username, email } },
    secret,
    { expiresIn: expiration }
  )
}

module.exports = {
  authMiddleware,
  signToken,
}
