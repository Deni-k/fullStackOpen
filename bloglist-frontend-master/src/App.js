import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Login from './components/Login'
import Blog from './components/Blog'
import Message from './components/Message'
import { initializeBlogs } from './reducers/blogReducer' 
import { relog ,login, logout, initializeUsers} from './reducers/userReducer'
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import SelectedBlog from './components/SelectedBlog'
import Users from './components/Users'
import User from './components/User'
import { Button, Navbar, Nav } from 'react-bootstrap'
const App = (props) =>{
  const {initializeBlogs, initializeUsers, relog} = props
  useEffect(() => {
    initializeBlogs()
    initializeUsers()
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) relog(JSON.parse(loggedUserJSON))
  }, [initializeBlogs, initializeUsers, relog])
  const padding = {
    padding: 5
  }
  const menu = {
    backgroundColor: 'grey'
  }
  return (
    <div class="container">
        {!props.user.loggedInUser ?
        <div>
          <h2>Log in to application</h2>
          <Message></Message>
          <Login></Login>
        </div>
        :
        <div>
          <Router>
          <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#" as="span">
                    <Link style = {padding} to="/blogs">blogs</Link>
                  </Nav.Link>
                  <Nav.Link href="#" as="span">
                    <Link style = {padding} to="/users">users</Link>
                  </Nav.Link>
                  <Nav.Link href="#" as="span">
                    {props.user.loggedInUser.name} logged in
                    <Button onClick={()=>{
                    props.logout()}}>LogOut</Button>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            <div style={menu}>
              
              
              
            </div>
            <h2>blogs app</h2>
            <Message></Message>
              <Route exact path="/blogs" render={() => <Blog></Blog>}></Route>
              <Route exact path="/blogs/:id" render={({match}) => {
                return(<SelectedBlog id={match.params.id}></SelectedBlog>)}}></Route>
              <Route exact path="/users" render={() => <Users></Users>}></Route>
              <Route exact path="/users/:id" render={({match}) => <User id={match.params.id}></User>}
              ></Route>
              </div>
          </Router>
          {/* <Blog></Blog> */}
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
const mapDispatchToProps = {
  initializeBlogs,
  initializeUsers,
  login,
  logout,
  relog
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
