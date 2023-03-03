// Dependencies.
import { gql } from "@apollo/client"

export const SIGN_UP = gql`
	mutation SignUp(
		$username: String!,
		$email: String!,
		$password: String!
	) {
		signUp(
			username: $username,
			email: $email,
			password: $password
		) {
			user {
				_id
				username
				email
			}
			token
		}
	}
`

export const SIGN_IN = gql`
	mutation SignIn(
		$email: String!,
		$password: String!
	) {
		signIn(
			email: $email,
			password: $password
		) {
			user {
				_id
				email
				username
			}
			token
		}
	}
`

export const SAVE_BOOK = gql`
	mutation SaveBook(
		$username: String!,
		$bookId: String!,
		$title: String!,
		$description: String!,
		$authors: [String],
		$image: String,
		$link: String
	) {
		saveBook(
			username: $username,
			bookId: $bookId,
			title: $title,
			description: $description,
			authors: $authors,
			image: $image,
			link: $link
		) {
			_id
			username
			email
			bookCount
			savedBooks {
				bookId
				title
				authors
				description
				image
				link
			}
		}
	}
`

export const DELETE_BOOK = gql`
	mutation DeleteBook(
		$username: String!,
		$bookId: String!
	) {
		deleteBook(
			username: $username,
			bookId: $bookId
		) {
			_id
			username
			email
			savedBooks {
				bookId
				title
				authors
				description
				image
				link
			}
			bookCount
		}
	}
`
