import blogService from '../services/blogs'
const blogReducer = (state = {}, action) => {
  switch(action.type){
    case 'NEW_BLOG':
      return {blogs:[...state.blogs, action.data], selectedBlog: state.selectedBlog} 
    case 'INIT_BLOGS':
      return {blogs:action.data, selectedBlog: state.selectedBlog}
    case 'LIKE':
        const id = action.data.id
        const changed = action.data.content
        return {blogs: state.blogs.map(s => s.id !== id ? s : changed), selectedBlog: changed}
    case 'DELETE':
        const delete_id = action.data
        return state.blogs.filter(s => s.id !== delete_id)
    case 'SELECT': 
        return {blogs:state.blogs, selectedBlog: action.data}
    case 'COMMENT':
        const comment_id = action.data.id
        return {blogs: state.blogs.map(s => s.id !== comment_id ? s : {...s, comments:s.comments.concat(action.data.comment)}), selectedBlog: {...state.selectedBlog, comments: state.selectedBlog.comments.concat(action.data.comment)}}
    default:
      return state
  }
}
export const addBlog = (content)=> {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}
export const deletePost = (id) => {
  return async dispatch => {
    await blogService.del(id)
    dispatch({
      type: 'DELETE',
      data: id
    })
  }
}
export const setSelectedBlog = (id) => {
  return async dispatch => {
    const selectedBlog = await blogService.get(id)
    dispatch({
      type: 'SELECT',
      data: selectedBlog
    })
  }
}
export const likeForBlog = (id, content) => {
  return async dispatch => {
    const {user:user1,...blog} = content
    blog.user = content.user.id
    await blogService.update(id, blog)
    dispatch({
      type: 'LIKE',
      data: {
        id,
        content
      }
    })
  }
}
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    const initialBlogs = blogs.map((blog) => {
      const newBlog = {...blog, clicked:false}
      return newBlog
    });
    dispatch({
      type: 'INIT_BLOGS',
      data: initialBlogs
    })
  }
}
export const postComment = (id, comment) => {
  return async dispatch => {
    await blogService.comment(id, comment)
    dispatch({
        type: 'COMMENT',
        data: {
          id,
          comment}
      })
  }
}
export default blogReducer