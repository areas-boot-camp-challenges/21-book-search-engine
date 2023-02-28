// Models.
const { User } = require("../models")

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
}

module.exports = resolvers
