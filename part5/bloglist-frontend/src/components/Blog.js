import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, setUpdate }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLikes = async () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    await blogService.update(blog.id, newBlog)
    setUpdate(Math.random())
  }
  const handleRemove = async () => {
    if (!window.confirm(`Remove blog "${blog.title}" by ${blog.author}`)) {
      return
    }
    await blogService.deleteBlog(blog.id)
    setUpdate(Math.random())
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>{blog.likes} likes <button onClick={handleLikes}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username &&
                    <button onClick={handleRemove}>remove</button>}
      </div>
    </div>
  )
}

export default Blog