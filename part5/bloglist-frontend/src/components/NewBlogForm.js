import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div><h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title</label>
          <input
            className={'titleInput'}
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">author</label>
          <input
            className={'authorInput'}
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">url</label>
          <input
            className={'urlInput'}
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type="submit" className={'createButton'}>create</button>
      </form>
    </div>
  )
}

NewBlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default NewBlogForm