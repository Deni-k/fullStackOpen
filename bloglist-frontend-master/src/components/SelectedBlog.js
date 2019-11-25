import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { deletePost, likeForBlog, setSelectedBlog, postComment} from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'
const SelectedBlog = (props) => {
  const commentForm = useField('text')
  const {clear:clear1,...commentInput} = commentForm
  const {setSelectedBlog} = props
  const {id} = props
  useEffect(()=>{
    setSelectedBlog(id)
  }, [id, setSelectedBlog])
  const createComment = () => {
    props.postComment(props.blog.selectedBlog.id, commentForm.value)
  }
  const deletePost = (blog) => {
    const confirm = window.confirm(`remove blog ${props.blog.selectedBlog.title} by ${props.blog.selectedBlog.author}`)
    if(confirm){
      props.deletePost(blog.id)
    }
  }
  return(
    <div>
    {!props.blog.selectedBlog ?
    <div></div>
    :
    <div>
      <h2>{props.blog.selectedBlog.title} {props.blog.selectedBlog.author}</h2>
      <a href={props.blog.selectedBlog.url}>{props.blog.selectedBlog.url}</a>
      <p>{props.blog.selectedBlog.likes}<Button onClick={() => props.likeForBlog(props.blog.selectedBlog.id, {...props.blog.selectedBlog, likes: props.blog.selectedBlog.likes+1})}>like</Button></p>
      <p>added by {props.blog.selectedBlog.user.name}</p>
      <Button onClick={() => deletePost(props.blog.selectedBlog)}>remove</Button>
      <h3>comments</h3>
      <ul>
        {props.blog.selectedBlog.comments.map((comment) => <li key= {comment.id}>{comment}</li>)}
      </ul>
      <Form onSubmit={createComment}>
        <Form.Group>
          <Form.Control {...commentInput}></Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">add comment</Button>
      </Form>
    </div>
    }
  </div>
  )
}
const mapStateToProps = (state) => {
  return {
    blog: state.blog
  }
}
const mapDispatchToProps = {
  postComment,
  setSelectedBlog,
  deletePost,
  likeForBlog
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectedBlog)