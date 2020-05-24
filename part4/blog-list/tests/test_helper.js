const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: 'test-title-1',
		author: 'test-author-1',
		url: 'test-url-1',
		likes: 100,
	},
	{
		title: 'test-title-2',
		author: 'test-author-2',
		url: 'test-url-2',
		likes: 200,
	},
]

const nonExistingId = async () => {
	const blog = new Blog({ title: 'willremovethissoon' })
	await blog.save()
	await blog.remove()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(blog => blog.toJSON())
}

module.exports = {
	initialBlogs, nonExistingId, blogsInDb, usersInDb
}