import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import userEvent from '@testing-library/user-event'


describe('NewBlogForm', () => {
  const mockHandler = jest.fn(
    e => e.preventDefault()
  )

  let component

  beforeEach( () => {
    component = render(
      <NewBlogForm createBlog={mockHandler}/>
    )
  })


  test('creates a new blog ',async () => {
    const user = userEvent.setup()
    const titleInput = component.container.querySelector('.titleInput')
    await user.type(titleInput, 'My title')
    const authorInput = component.container.querySelector('.authorInput')
    await user.type(authorInput, 'My author')
    const urlInput = component.container.querySelector('.urlInput')
    await user.type(urlInput, 'My url')
    const button = component.container.querySelector('.createButton')
    await user.click(button)
    expect(button).toHaveTextContent('create')
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('My title')
    expect(mockHandler.mock.calls[0][0].author).toBe('My author')
    expect(mockHandler.mock.calls[0][0].url).toBe('My url')
  })
})