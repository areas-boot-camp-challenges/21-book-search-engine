// Dependencies.
import React, { useState } from "react"
import { Form, Button, Alert } from "react-bootstrap"

// API and authentication.
import { useMutation } from "@apollo/client"
import { SIGN_UP } from "../gql/mutations"
import Auth from "../utils/auth"

// Component.
const SignupForm = () => {
  // Set the form data initial state.
  const [userFormData, setUserFormData] = useState({ username: "", email: "", password: "" })
  // Set the form validation initial state.
  const [validated] = useState(false)
  // Set the alert initial state.
  const [showAlert, setShowAlert] = useState(false)
  // Create a mutation to sign up.
  const [signUp, { error, data }] = useMutation(SIGN_UP)

  // Update the form data.
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserFormData({ ...userFormData, [name]: value })
  }

  // Sign up the user.
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    // Validate the form (as per react-bootstrap docs).
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    // Sign up.
    try {
      const { data } = await signUp({
        variables: { ...userFormData },
      })
      Auth.signIn(data.signUp.token)
    } catch (err) {
      console.error(err)
      setShowAlert(true)
    }
    // Clear the form.
    setUserFormData({
      username: "",
      email: "",
      password: "",
    })
  }

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* show alert if server response is bad */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
          Something went wrong with your signup!
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
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
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type="submit"
          variant="success">
          Submit
        </Button>
      </Form>
    </>
  )
}

export default SignupForm
