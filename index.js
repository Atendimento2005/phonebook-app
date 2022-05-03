const { response } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())

morgan.token("body", (req, res) => {
	if(req.method === 'POST'){
		return JSON.stringify(req.body)
	}

	return " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = 3001

const requestLogger = (req, res, next) => {
	console.log("Method:", req.method)
	console.log("Path:  ", req.path )
	console.log("Body:  ", req.body)
	console.log("------")
	next()
}

// app.use(requestLogger)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
	res.send(persons)
})

app.get("/info", (req, res) => {
	res.send(`
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${new Date()}</p>
	`)
})

app.get("/api/persons/:id", (req, res) => {
	const id = parseInt(req.params.id)
	const person = persons.find(person => person.id === id)
	
	if(!person){
		return res.status(404).send({error: "Person not found"})
	}
	
	res.send(person)
})

app.delete("/api/persons/:id", (req, res) => {
	const id = parseInt(req.params.id)
	persons = persons.filter(person => person.id !== id)

	res.status(204).end()
})

app.post("/api/persons", (req, res) => {
	const person = req.body

	if(!person.number || !person.name){
		return res.status(400).send({error: "Name or number is missing"})
	}

	if(persons.find(p => p.name === person.name)){
		return res.status(400).send({error: "Name must be unique"})
	}

	const newPerson = {
		id: Math.floor(Math.random()*1000000),
		name: person.name,
		number: person.number
	}
	persons = persons.concat(newPerson)
	res.send(newPerson)
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

app.listen(PORT)
console.log(`Running on port ${PORT}`)