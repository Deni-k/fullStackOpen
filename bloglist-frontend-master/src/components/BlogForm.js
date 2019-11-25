import React from 'react'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import {addBlog} from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'
const BlogForm = (props) => {
  const title = useField('text');
  const author = useField('text');
  const url = useField('text')
  const {clear:clear1,...titleInput} = title
  const {clear:clear2,...authorInput} = author
  const {clear:clear3,...urlInput} = url
  const createBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
      userId: props.user.loggedInUser.id
    }
    props.addBlog(newBlog)
    props.createNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`,5)
    props.tog()
    title.clear()
    author.clear()
    url.clear()
  }
  return (
    <Form onSubmit={createBlog}>
      <Form.Group>
        <Form.Label>title:</Form.Label>
        <Form.Control id="title"{...titleInput}></Form.Control> 
        <Form.Label>author:</Form.Label>
        <Form.Control id="author" {...authorInput}></Form.Control> 
        <Form.Label>url:</Form.Label>
        <Form.Control id="url" {...urlInput}></Form.Control> 
        <Button id="create" variant="primary" type="submit">
          create
        </Button>
      </Form.Group>
    </Form>
    // <form onSubmit={createBlog}>
    //   <div>
    //     title
    //       <input {...titleInput}
    //     />
    //   </div>
    //   <div>
    //     author
    //       <input
    //       {...authorInput}
    //     />
    //   </div>
    //   <div>
    //     url
    //       <input
    //       {...urlInput}
    //     />
    //   </div>
    //   <button type="submit">create</button>
    // </form> 

  )
}
const mapDispatchToProps = {
  addBlog,
  createNotification,
}
const mapStateToProps = (state) => {
  return{
    user: state.user
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogForm)

