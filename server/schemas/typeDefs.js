// Dependencies.
const { gql } = require("apollo-server-express")

const typeDefs = gql`
	type User {
		_id: ID!
		username: String!
		email: String!
		savedBooks: [Book]!
		bookCount: Int
	}

	type Book {
		bookId: String!
		title: String!
		authors: [String]
		description: String!
		image: String
		link: String
	}

	type Auth {
		user: User
		token: ID!
	}

	type Query {
		users: [User]
		user(username: String!): User
	}

	type Mutation {
		signUp(
			username: String!
			email: String!
			password: String!
		): Auth
		signIn(
			email: String!
			password: String!
		): Auth
		saveBook(
			username: String!
			bookId: String!
			title: String!
			authors: [String]
			description: String!
			image: String
			link: String
		): User
		deleteBook(
			username: String!
			bookId: String!
		): User
	}
`

module.exports = typeDefs
