const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info(`Connecting to ${config.MONGODB_URL}`)

mongoose.connect(config.MONGODB_URL)
	.then(() => {
		logger.info('Connected to MongoDB')
	})
	.catch((err) => {
		logger.error(`error connecting to MongoDB: ${err.message}`)
	})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app