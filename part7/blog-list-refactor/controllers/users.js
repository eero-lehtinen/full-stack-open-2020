const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')

usersRouter.post('/', async (request, response) => {
	const body = request.body

	if (body.password === undefined) {
		let err = new Error('Password not supplied')
		err.name = 'ValidationError'
		throw err
	}
	else if (body.password.length < 3) {
		let err = new Error('Password is less than 3 characters long')
		err.name = 'ValidationError'
		throw err
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash,
	})

	const savedUser = await user.save()

	response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })

	response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter
