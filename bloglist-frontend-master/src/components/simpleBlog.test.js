import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import SimpleBlog from './simpleBlog'

let component
let blog = {
  title: 'Test this',
  author: 's***',
  likes: 42
}
let mockHandler = jest.fn()
beforeEach(() => {

  component = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )
})
describe('Render Title, Author and amount of likes', () =>{
  test('renders title and author', () => {
    const div = component.container.querySelector('.titleAuthor')
    expect(div).toHaveTextContent(
      'Test this s***'
    )
  })
  test('renders likes', () => {
    const div = component.container.querySelector('.likes')
    expect(div).toHaveTextContent(
      `blog has ${blog.likes} likes`
    )
  })
})
describe('Test button functionality', () => {
  test('test like Button', () => {
    const { getByText } = component
    const button = getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    expect(mockHandler.mock.calls.length).toBe(2)
  })
})