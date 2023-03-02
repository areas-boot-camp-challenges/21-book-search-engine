// Models.
const { User } = require("../models")

// Middleware.
const { AuthenticationError } = require("apollo-server-express")
const { signToken } = require("../utils/auth")

// Resolvers.
const resolvers = {
	Query: {
		users: async () => {
			return await User.find()
		},
		user: async (parent, { username }) => {
			return await User.findOne({ username })
		},
	},
	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password })
			const token = signToken(user)
			return { user, token }
		},
		signIn: async (parent, { username, password }) => {
			const user = await User.findOne({ username })
			if (!user) {
				throw new AuthenticationError("User not found.")
			}
			const validPassword = await user.validatePassword(password)
			if (!validPassword) {
				throw new AuthenticationError("Incorrect password.")
			}
			const token = signToken(user)
			return { user, token }
		},
		saveBook: async (parent, { username, bookId, title, authors, description, image, link }) => {
			const user = await User.findOneAndUpdate(
				{ username },
				{ $addToSet: { savedBooks: { bookId, title, authors, description, image, link } } },
				{ new: true, runValidators: true },				
			)
			return user
		},
		deleteBook: async (parent, { username, bookId }) => {
			const user = await User.findOneAndUpdate(
				{ username },
				{ $pull: { savedBooks: { bookId: bookId } } },
				{ new: true },
			)
			if (!user) {
				return "User not found."
			}
			return user
		},
	},
}

module.exports = resolvers
