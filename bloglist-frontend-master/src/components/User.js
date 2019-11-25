import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {setSelectedUser} from "../reducers/userReducer"
const User = (props) => {
  const {setSelectedUser} = props;
  const {id} = props
  useEffect(()=>{
    setSelectedUser(id)
  }, [id, setSelectedUser])
  return(
    <div>
      {!props.user.selectedUser ?
      <div> </div>
      :
    <div>
      <h2>{props.user.selectedUser.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {props.user.selectedUser.blogs.map((blog)=> <li key= {blog.id}>
          {blog.title}
        </li>)}
      </ul>
    </div>
      }
      </div>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(
  mapStateToProps,
  {setSelectedUser}
)(User)