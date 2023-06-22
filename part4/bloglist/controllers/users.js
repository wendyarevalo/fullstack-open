const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    if(!password){
        response.status(400).json({"error":"User validation failed: password: Path `password` is required."})
        return
    }

    if(password.length < 3){
        response.status(400).json({"error":`User validation failed: password: Path 'password' ('${password}') is shorter than the minimum allowed length (3).`})
        return
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch(exception) {
        next(exception)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter