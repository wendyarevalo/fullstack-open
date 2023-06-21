const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.author,
        likes: body.likes || 0
    })

    try {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogRouter