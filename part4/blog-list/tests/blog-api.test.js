const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('right amount of blogs are returned', async () => {
	const response = await api.get('/api/blogs')

	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs have property id', async () => {
	const blogs = await helper.blogsInDb()
	for (let blog of blogs) {
		expect(blog.id).toBeDefined()
	}
})

test('blogs can be added', async () => {
	const blog = new Blog({
		title: 'added',
		author: 'added',
		url: 'added',
		likes: 10,
	})
	await api.post('/api/blogs').send(blog).expect(201)

	const newBlogs = await helper.blogsInDb()

	expect(newBlogs).toHaveLength(helper.initialBlogs.length + 1)
	expect(newBlogs.map(blog => blog.title)).toContain('added')
})

test('likes is zero if it is emitted when saving', async () => {
	const blog = new Blog({
		title: 'added',
		author: 'added',
		url: 'added'
	})

	const response = await api.post('/api/blogs').send(blog).expect(201)

	const newBlog = response.body

	expect(newBlog.likes).toBe(0)
})


test('responds with 400 if title or url are not set', async () => {
	// Silence errors for this test, because they are expected
	const consoleError = console.error
	console.error = jest.fn()

	let blog = new Blog({
		title: 'added',
		url: 'added',
		likes: 10
	})

	await api.post('/api/blogs').send(blog).expect(400)

	blog = new Blog({
		author: 'added',
		url: 'added',
		likes: 10
	})

	await api.post('/api/blogs').send(blog).expect(400)

	blog = new Blog({
		url: 'added',
		likes: 10
	})

	await api.post('/api/blogs').send(blog).expect(400)

	console.error = consoleError
})

afterAll(() => {
	mongoose.connection.close()
})