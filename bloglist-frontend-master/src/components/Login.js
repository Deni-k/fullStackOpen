import React from 'react'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { login } from '../reducers/userReducer'
import { createErrorNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'
const Login =  (props) => {
  const username = useField('text')
  const password = useField('password')
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      props.login({username: username.value, password: password.value})
      password.clear()
      username.clear()
    } catch(exception) {
      createErrorNotification('wrong username or password', 5)
    }
  }
  const {clear:clear1,...usernameInput} = username
  const {clear:clear2,...passwordInput} = password
  return(
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control {...usernameInput}></Form.Control> 
        <Form.Label>password</Form.Label>
        <Form.Control {...passwordInput}></Form.Control> 
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form.Group>
    </Form>
  )
}
const mapDispatchToProps = {
  createErrorNotification,
  login
}
export default connect(
  null,
  mapDispatchToProps
)(Login)