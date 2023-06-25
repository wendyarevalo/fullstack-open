const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require("../utils/middleware");

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body

    const user = request.user

    try {
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.author,
            likes: body.likes || 0,
            user: user.id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } catch (exception) {
        next(exception)
    }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response,next) => {

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    try {
        if (blog.user.toString() === user.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        }
    } catch (exception) {
        next(exception)
    }

})

blogRouter.put('/:id', async (request, response, next) => {
    const blog = {
        ...request.body
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        response.json(updatedBlog)
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogRouter