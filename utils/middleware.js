const morgan = require('morgan')

morgan.token('body', (req, res) => {
	if(req.method === 'POST'){
		return JSON.stringify(req.body)
	}
	return ' '
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
	console.log(err.name)
	if(err.name === 'CastError'){
		return res.status(400).send({ error: 'malformatted id' })
	}else if(err.name === 'ValidationError'){
		return res.status(400).send({ error: err.message })
	}
	next(err)
}

module.exports = {
	unknownEndpoint,
	errorHandler,
	requestLogger
}