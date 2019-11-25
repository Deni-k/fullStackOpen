import React from 'react'
import { 
  render, waitForElement 
} from '@testing-library/react'
jest.mock('./services/blogs')
import App from './App'

describe('<App />', () => {
  test('if no user logged, blogs are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('Log in to application')
    ) 
    const element = component.container.querySelector('.login')
    expect(element).not.toBeNull()
    // expectations here
  })
  test('user is logged in', async () => {
    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Donald Tester'
    }
    localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    const component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('Log in to application')
    ) 
    

    const element = component.getByText('blogs')
    expect(element).not.toBeNull()
  })
})