require('dotenv').config()

const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { restart } = require('nodemon')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token("body", (req, res) => {
	if(req.method === 'POST'){
		return JSON.stringify(req.body)
	}
	return " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = process.env.PORT || 3001

const requestLogger = (req, res, next) => {
	console.log("Method:", req.method)
	console.log("Path:  ", req.path )
	console.log("Body:  ", req.body)
	console.log("------")
	next()
}

// app.use(requestLogger)

app.get("/api/persons", (req, res, err) => {
	Person.find({})
		.then(persons => {
			res.json(persons)
		}).catch(err => next(err))
})

app.get("/info", (req, res) => {
	res.send(`
	<p>Phonebook has info for ${persons.length} people</p>
	<p>${new Date()}</p>
	`)
})

app.get("/api/persons/:id", (req, res) => {
	Person.findById(req.params.id)
		.then(result => {
			res.json(result)
		})
		.catch(err => next(err))
})

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

app.put("/api/persons/:id", (req, res, next) => {

	const person = {
		name: req.body.name,
		number: req.body.number
	}
	Person.findByIdAndUpdate(req.params.id, person, {new: true, runValidators: true, context: 'query'})
		.then(updatedPerson => {
			if(!updatedPerson){
				res.status(400).send({error: "Person does not exist on the server"})
			}else{
				res.json(updatedPerson)
			}
		})
		.catch(err => next(err))
})


app.post("/api/persons", (req, res, next) => {
	const person = req.body

	if(!person.number || !person.name){
		return res.status(400).send({error: "Name or number is missing"})
	}
	
	Person.create({
		name: person.name,
		number: person.number,
		date: new Date()
	}).then(result => {
		res.json(result)
	}).catch(err => next(err))
})


const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) =>{
	console.log(err.name)
	if(err.name == "CastError"){
		return res.status(400).send({error: 'malformatted id'})
	}else if(err.name === 'ValidationError'){
		return res.status(400).send({error: err.message})
	}
	next(err)
}

app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`)
})