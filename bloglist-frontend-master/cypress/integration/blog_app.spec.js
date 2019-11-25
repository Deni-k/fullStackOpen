import user from "../../src/services/user"
import blogs from "../../src/services/blogs"

describe('Blog ', function() {
  beforeEach(async function() {
    cy.visit('http://localhost:3000')
    await user.deleteAll()
    await blogs.deleteAll()
    await user.createUser({
      username: "Tester",
      name: "Jon Doe",
      password: "12345678"
    })
  })
  it('front page can be opened', function() {
    cy.contains('Log in to application')
  })
  it('login form can be opened', function() {
    cy.contains('login').click()
  })
  it('user can login', function() {
    cy.contains('login').click()
    cy.get('input:first').type('Tester')
    cy.get('input:last').type('12345678')
    cy.contains('login').click()
    cy.contains('Tester logged in')
  })
  it('a new blog can be created', function() {
    cy.get('input:first').type('Tester')
    cy.get('input:last').type('12345678')
    cy.contains('login').click()
    cy.contains('blogs').click()
    cy.contains('new blog').click()
    cy.get('#title').type('a blog is created')
    cy.get('#author').type('Cypress')
    cy.get('#url').type('cypress')
    cy.get('#create').click()
    cy.contains('a blog is created Cypress')
  })
  it('a blog can be liked', function() {
    cy.get('input:first').type('Tester')
    cy.get('input:last').type('12345678')
    cy.contains('login').click()
    cy.contains('blogs').click()
    cy.contains('new blog').click()
    cy.get('#title').type('a blog is created')
    cy.get('#author').type('Cypress')
    cy.get('#url').type('cypress')
    cy.get('#create').click()
    cy.contains('a blog is created Cypress').click()
    cy.contains('like').click()
    cy.contains('1')
  })
  it('a blog can be commented', function() {
    cy.get('input:first').type('Tester')
    cy.get('input:last').type('12345678')
    cy.contains('login').click()
    cy.contains('blogs').click()
    cy.contains('new blog').click()
    cy.get('#title').type('a blog is created')
    cy.get('#author').type('Cypress')
    cy.get('#url').type('cypress')
    cy.get('#create').click()
    cy.contains('a blog is created Cypress').click()
    cy.get('input:first').type('Test')
    cy.contains('add comment').click()
    cy.contains('Test')
  })
  // it('all users can be shown', function() {
  //   cy.get('input:first').type('Tester')
  //   cy.get('input:last').type('12345678')
  //   cy.contains('login').click()
  //   cy.contains('users').click()
  //   cy.contains('Jon Doe')
  // })
})