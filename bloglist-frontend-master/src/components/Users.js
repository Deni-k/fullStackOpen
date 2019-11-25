import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'
import {Table} from 'react-bootstrap'
const Users = (props) => {
  return (
    <div>
      <Table striped>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
        {!props.user.users || !props.blog.blogs ? 
        <tbody>
        </tbody>
        :
        props.user.users.map((user) => 
        <tbody>
          <tr>
            <th><Link to={`/users/${user.id}`}>{user.name}</Link></th>
            <th>{props.blog.blogs.filter((blog) => blog.user.id === user.id || blog.user === user.id).length}</th>
          </tr>
        </tbody>
        )}
      </Table>
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    blog: state.blog,
    user: state.user
  }
}
export default connect(
  mapStateToProps,
  null
)(Users)