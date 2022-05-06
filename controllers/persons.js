const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (req, res, next) => {
	console.log('sussy')
	Person.find({})
		.then(persons => {
			res.json(persons)
		}).catch(err => next(err))
})

personsRouter.post('/', (req, res, next) => {
	const person = req.body

	if(!person.number || !person.name){
		return res.status(400).send({ error: 'Name or number is missing' })
	}

	Person.create({
		name: person.name,
		number: person.number,
		date: new Date()
	}).then(result => {
		res.json(result)
	}).catch(err => next(err))
})

personsRouter.get('/info', (req, res, next) => {
	Person.find({})
		.then(persons => {
			res.send(`
			<p>Phonebook has info for ${persons.length} people</p>
			<p>${new Date()}</p>
			`)
		}).catch(err => next(err))
})

personsRouter.get('/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(result => {
			res.json(result)
		})
		.catch(err => next(err))
})

personsRouter.delete('/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(err => next(err))
})

personsRouter.put('/:id', (req, res, next) => {

	const person = {
		name: req.body.name,
		number: req.body.number
	}
	Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
		.then(updatedPerson => {
			if(!updatedPerson){
				res.status(400).send({ error: 'Person does not exist on the server' })
			}else{
				res.json(updatedPerson)
			}
		})
		.catch(err => next(err))
})

module.exports = personsRouter