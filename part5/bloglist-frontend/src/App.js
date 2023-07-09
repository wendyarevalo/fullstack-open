import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [update, setUpdate] = useState(null)

  const [notificationMessage, setNotificationMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [update])

  const clearMessageAfterSeconds = () => setTimeout(() => {
    setNotificationMessage(null)
  }, 5000)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('Wrong credentials')
      clearMessageAfterSeconds()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLikes = async (blogObject) => {
    const newBlog = {
      title: blogObject.title,
      author: blogObject.author,
      url: blogObject.url,
      likes: blogObject.likes + 1
    }
    await blogService.update(blogObject.id, newBlog)
    setUpdate(Math.random())
  }
  const handleRemove = async (blogObject) => {
    if (!window.confirm(`Remove blog "${blogObject.title}" by ${blogObject.author}`)) {
      return
    }
    await blogService.deleteBlog(blogObject.id)
    setUpdate(Math.random())
  }

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    } catch (exception) {
      setNotificationMessage('Error creating new blog')
    }
    clearMessageAfterSeconds()
  }

  const blogFormVisible = () => {
    return (
      <Togglable buttonLabel="new blog"  ref={blogFormRef}>
        <NewBlogForm createBlog={createBlog}/>
      </Togglable>
    )
  }

  const blogPosts = () => (
    <div className='divBlogs'>
      {blogs.sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user} handleLikes={handleLikes} handleRemove={handleRemove}/>
        )}
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      {notificationMessage &&
                <Notification message={notificationMessage}/>}
      {!user &&
                <Togglable buttonLabel="log in">
                  <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleSubmit={handleLogin}
                  />
                </Togglable>
      }
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
        {blogFormVisible()}
        <h2>Blogs</h2>
        {blogPosts()}
      </div>
      }
    </div>
  )
}

export default App