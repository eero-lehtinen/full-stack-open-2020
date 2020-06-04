const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
require('express-async-errors')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

	response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
	const decodedToken = jwt.verify(request.token, config.SECRET)
	if (!request.token || !decodedToken.id || !decodedToken.username) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = await User.findById(decodedToken.id)

	const blog = new Blog({ user: user._id, ...request.body })

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	const populatedSavedBlog = await savedBlog.execPopulate('user', { username: 1, name: 1 })

	response.status(201).json(populatedSavedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, config.SECRET)
	if (!request.token || !decodedToken.id || !decodedToken.username) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const blog = await Blog.findById(request.params.id)
	if (blog.user.toString() !== decodedToken.id) {
		return response.status(401).json({ error: 'invalid permissions' })
	}

	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	let blog = request.body

	// Change from populated user to depopulated id
	if (typeof blog.user !== 'string') {
		blog.user = blog.user.id
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

	const populatedUpdatedBlog = await updatedBlog.execPopulate('user', { username: 1, name: 1 })

	response.json(populatedUpdatedBlog)
})

module.exports = blogsRouter
