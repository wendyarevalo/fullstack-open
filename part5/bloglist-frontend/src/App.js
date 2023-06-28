import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

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
        setErrorMessage('Wrong credentials')
        setTimeout(() => {
            setErrorMessage(null)
        }, 5000)
    }
  }

  const handleLogout = () => {
      window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => (
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
  )

    const blogForm = () => (
        <form onSubmit={handleNewBlog}>
            <div>
                title
                <input
                    type="text"
                    value={title}
                    name="Title"
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    value={author}
                    name="Author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={url}
                    name="Url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    )

    const handleNewBlog = async (event) => {
        event.preventDefault()
        try {
            const whatever = await blogService.create({
                "title": title,
                "author": author,
                "url": url,
                "likes": 0,
            })
        } catch (exception) {
            setErrorMessage('Error creating new blog')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const blogPosts = () => (
        <div>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )

  return (
    <div>
      <h1>Blogs</h1>

      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p> <button onClick={handleLogout}>Logout</button>
          {blogForm()}
        {blogPosts()}
      </div>
      }

      <h2>Blogs</h2>
    </div>
  )
}

export default App