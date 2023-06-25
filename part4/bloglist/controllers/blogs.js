const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require("jsonwebtoken")

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.author,
        likes: body.likes || 0,
        user: user.id
    })

    try {
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } catch(exception) {
        next(exception)
    }
})

blogRouter.delete('/:id', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === user.id.toString() ){
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    }else{
        return response.status(401).json({ error: 'token invalid' })
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