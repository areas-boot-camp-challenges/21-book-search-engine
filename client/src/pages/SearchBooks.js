// Dependendenies.
import React, { useState, useEffect } from "react"
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap"

// API and authentication.
import { searchGoogleBooks } from "../utils/API"
import { saveBookIds, getSavedBookIds } from "../utils/localStorage"
import { useMutation } from "@apollo/client"
import { SAVE_BOOK } from "../gql/mutations"
import Auth from "../utils/auth"

// Component.
const SearchBooks = () => {
  // Set the search results initial state.
  const [searchedBooks, setSearchedBooks] = useState([])
  // Set the search input initial state.
  const [searchInput, setSearchInput] = useState("")
  // Set the saved book IDs initial state.
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds())
  // Set up useEffect hook to save `savedBookIds` list to localStorage on component unmount.
  // Learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup.
  useEffect(() => {
    return () => saveBookIds(savedBookIds)
  })
  // Create a mutation to save the book.
  const [saveBook, { error, data }] = useMutation(SAVE_BOOK)

  // Search for books.
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    // If the search field is empty, return false.
    if (!searchInput) {
      return false
    }
    // Else, search.
    try {
      // Call the API.
      const response = await searchGoogleBooks(searchInput)
      // If there’s no response, throw an error.
      if (!response.ok) {
        throw new Error("Sorry, something went wrong.")
      }
      // Pull the items from the response.
      const { items } = await response.json()
      // Map the items to the fields to save to the database.
      const bookData = items.map((book) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        authors: book.volumeInfo.authors || ["No author to display"],
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }))
      // Set the state with the new data.
      setSearchedBooks(bookData)
      // Clear the search input.
      setSearchInput("")
    } catch (err) {
      // If there’s an error, log it.
      console.error(err)
    }
  }

  // Save a book.
  const handleSaveBook = async (bookId) => {
    // Find the book in `searchedBooks` state by the matching ID.
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId)
    console.log(bookToSave) // **********
    // Get the user’s token.
    const token =
      Auth.loggedIn()
        ? Auth.getToken()
        : null
    console.log(token) // **********
    // If there’s no token, return false.
    if (!token) {
      return false
    }
    // Save.
    try {
      const { data } = await saveBook({
        variables: {
          ...bookToSave,
          username: Auth.getProfile().data.username,
        },
      })
      setSavedBookIds([...savedBookIds, bookToSave.bookId])
      console.log(savedBookIds) // **********
    } catch (err) {
      // If there’s an error, log it.
      console.error(err)
    }    
  }

  return (
    <>
      <div className="text-light bg-dark pt-5"> {/* Deleted “fluid” attribute. Was it needed? */}
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book, index) => {
            return (
              <Col key={index} md="4">
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
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

export default SearchBooks
