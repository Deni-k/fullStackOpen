import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent} from '@testing-library/react'
import Blog from './Blog'

let component
let blog = {
  title: 'Test this',
  author: 's***',
  likes: 42,
  user: {
    name: "Adolph"
  }
}
let mockHandler = jest.fn()
beforeEach(() => {

  component = render(
    <Blog blog={blog}/>
  )
})
describe('Blog content test', () => {
  test('only title and author are shown before click', () => {
    const element = component.getByText(`${blog.title} ${blog.author}`)
    expect(element).toBeDefined()
  })
  test('After click other information is shown', () => {
    const button = component.container.querySelector('.lessInformation')
    fireEvent.click(button)

    const moreInformation = component.container.querySelector('.moreInformation')
    expect(moreInformation).toBeDefined
  })
})