import { useState } from 'react'

const Blog = ({ blog, user, handleLikes, handleRemove }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
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
      <div style={hideWhenVisible} className="blogCollapsedDiv">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="blogExpandedDiv">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} likes <button onClick={() => handleLikes(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username &&
                    <button onClick={() => handleRemove(blog)}>remove</button>}
      </div>
    </div>
  )
}

export default Blog