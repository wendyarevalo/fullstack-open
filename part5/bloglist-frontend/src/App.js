import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from "./components/Notification";

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const [notificationMessage, setNotificationMessage] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

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

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit">login</button>
        </form>
    )

    const blogForm = () => (
        <form onSubmit={handleNewBlog}>
            <div>
                <label htmlFor="title">title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    name="Title"
                    onChange={({target}) => setTitle(target.value)}
                />
            </div>
            <div>
                <label htmlFor="author">author</label>
                <input
                    id="author"
                    type="text"
                    value={author}
                    name="Author"
                    onChange={({target}) => setAuthor(target.value)}
                />
            </div>
            <div>
                <label htmlFor="url">url</label>
                <input
                    id="url"
                    type="text"
                    value={url}
                    name="Url"
                    onChange={({target}) => setUrl(target.value)}
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
            setNotificationMessage(`A new blog "${whatever.title}" by ${whatever.author} added`)
        } catch (exception) {
            setNotificationMessage('Error creating new blog')
        }
        clearMessageAfterSeconds()
    }

    const blogPosts = () => (
        <div>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog}/>
            )}
        </div>
    )

    return (
        <div>
            <h1>Blogs</h1>
            {notificationMessage &&
                <Notification message={notificationMessage} />}
            {!user && loginForm()}
            {user && <div>
                <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
                <h2>create new</h2>
                {blogForm()}
                <h2>Blogs</h2>
                {blogPosts()}
            </div>
            }
        </div>
    )
}

export default App