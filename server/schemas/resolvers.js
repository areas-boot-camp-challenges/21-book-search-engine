// Models.
const { User } = require("../models")

// Resolvers.
const resolvers = {
	Query: {
		users: async () => {
			return await User.find().populate("savedBooks")
		},
		user: async (parent, { username }) => {
			return await User.findOne({ username }).populate("savedBooks")
		},
	},
}

module.exports = resolvers
