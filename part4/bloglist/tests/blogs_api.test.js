const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('verify id exists', async () => {
    const blog = {
        title: 'React patterns 2',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    }
    const response = await api.post('/api/blogs').send(blog)
    expect(response.body.id).toBeDefined()
})

test('successfully creates a new blog', async () => {
    const blog = {
        title: 'React patterns 3',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
        'React patterns 3'
    )
})

describe('missing property', () => {
    test('"likes" defaults to 0', async () => {
        const blog = {
            title: 'React patterns 4',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
        }
        const response = await api.post('/api/blogs').send(blog)
        expect(response.body.likes).toBe(0)
    })

    test('"title" returns 400', async () => {
        const blog = {
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
        }
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})