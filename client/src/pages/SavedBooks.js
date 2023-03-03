// Dependencies.
import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Button, Card, Col, Container, Row } from "react-bootstrap"

// APIs.
import { GET_USER } from "../gql/queries"
import { DELETE_BOOK } from "../gql/mutations"

// Local storage.
import { removeBookId } from "../utils/localStorage"

// Auth.
import Auth from "../utils/auth"

// Component.
const SavedBooks = () => {
  // Get the user’s username from their token.
  const username = Auth.getProfile().data.username
  
  // Get the user data.
  const { loading, data } = useQuery(GET_USER, {
    variables: { username },
  })

  // Set the user data.
  const userData = data?.user || {}  

  // Create a mutation to delete the book.
  const [deleteBook] = useMutation(DELETE_BOOK)

  // Delete a book.
  const handleDeleteBook = async (bookId) => {
    try {
      // Call the API.
      const { data } = await deleteBook({
        variables: { username, bookId },
      })
      removeBookId(bookId)
    } catch (err) {
      console.error(err)
    }
  }

  // If loading, return “Loading...”.
  if (loading) {
    return <h2>Loading...</h2>
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book, index) => {
            return (
              <Col key={index} md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>
    </>
  )
}

export default SavedBooks
