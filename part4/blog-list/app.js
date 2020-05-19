const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')

const mongoose = require('mongoose')

require('express-async-errors')
const express = require('express')
const app = express()


logger.info('Connecting to', config.MONGO_URL)

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => {
		logger.info('Connected to MongoDB')
	})
	.catch(err => {
		logger.error('Error connecting to MongoDB:', err.message)
	})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
