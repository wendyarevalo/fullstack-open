import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog', () => {

  const user = {
    username: 'myuser',
    name: 'My User'
  }

  const blog = {
    title: 'This is a blog test',
    author: 'Great Author',
    url: 'www.example.com',
    likes: 0,
    id:123,
    user: user
  }

  const mockHandler = jest.fn()

  let component

  beforeEach( () => {
    component = render(
      <Blog blog={blog} user={user} handleLikes={mockHandler} handleRemove={mockHandler}/>
    )
  })

  test('renders only title and author', () => {
    const div = component.container.querySelector('.blogCollapsedDiv')
    expect(div).toHaveTextContent('This is a blog test')
    expect(div).toHaveTextContent('Great Author')
    expect(div).not.toHaveTextContent('www.example.com')
    expect(div).not.toHaveTextContent('likes')
  })

  test('renders url and likes when clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = component.container.querySelector('.blogExpandedDiv')
    expect(div).toHaveTextContent('www.example.com')
    expect(div).toHaveTextContent('0 likes')
  })

  test('clicking the like button twice calls event handler twice', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)

  })
})