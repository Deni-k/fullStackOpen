import React, {useEffect} from 'react'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { connect } from 'react-redux'
import { initializeBlogs} from '../reducers/blogReducer'
import { logout } from '../reducers/userReducer'
import { Link} from 'react-router-dom'
const Blog = (props) => {
  const {initializeBlogs} = props
  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWith: 1,
    marginBottom: 5
  }
  const tog = () => {
    blogFormRef.current.toggleVisibility()
  }
  const blogFormRef = React.createRef()
  return(
    <div>
      <h2>create new</h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm tog={tog}></BlogForm>
      </Togglable>
      {props.visibleBlogs.map((blog) =>
        <div key={blog.id} style={blogStyle}>
          <div className="lessInformation">
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author} </Link>
          </div>
        </div>
        // <div key={blog.id} style={blogStyle}>
        //   <div onClick={() => props.clickedBlog(blog.id, {...blog, clicked: !blog.clicked})} className="moreInformation">
        //     <p>{blog.title}</p>
        //     <p>{blog.author}</p>
        //     <p>{blog.likes} <button onClick={() => props.likeForBlog(blog.id, {...blog, likes: blog.likes+1})}>like</button></p>
        //     <p>added by {blog.user.name}</p>
        //     <button onClick={() => deletePost(blog)}>remove</button>
        //   </div>
        // </div>
      )}
    </div>
      
    )
    }
    const blogsToShow = ({blog, user}) => {
      if(!blog.blogs){
        return []
      }
      return blog.blogs.filter((b) => b.user.id === user.loggedInUser.id || b.user === user.loggedInUser.id).sort((a,b) => b.likes-a.likes)
    }
    const mapDispatchToProps = {
      initializeBlogs,
      logout,

    }
    const mapStateToProps = (state) => {
      return {
        visibleBlogs: blogsToShow(state),
        user: state.user
      }
    }

    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(Blog)