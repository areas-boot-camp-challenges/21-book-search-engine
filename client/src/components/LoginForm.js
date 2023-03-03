// Dependendenies.
import React, { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"

// API and authentication.
import { useMutation } from "@apollo/client"
import { SIGN_IN } from "../gql/mutations"
import Auth from "../utils/auth"

// Component.
const LoginForm = () => {
  // Set the form data initial state.
  const [userFormData, setUserFormData] = useState({ email: "", password: "" })
  // Set the form validation initial state.
  const [validated] = useState(false)
  // Set the alert initial state.
  const [showAlert, setShowAlert] = useState(false)
  // Create a mutation to sign in.
  const [signIn, { error, data }] = useMutation(SIGN_IN)

  // Update the form data.
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserFormData({ ...userFormData, [name]: value })
  }

  // Sign in the user.
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    // Validate the form (as per react-bootstrap docs).
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    // Sign in.
    try {
      console.log(userFormData) // **
      const { data } = await signIn({
        variables: { ...userFormData },
      })
      Auth.signIn(data.signIn.token)
    } catch (err) {
      console.error(err)
      setShowAlert(true)
    }
    // Clear the form.
    setUserFormData({
      email: "",
      password: "",
    })
  }

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="success">
          Submit
        </Button>
      </Form>
    </>
  )
}

export default LoginForm
