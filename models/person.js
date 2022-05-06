const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true
	},
	number: {
		type: String,
		validate: {
			validator: (val) => {
				return /^\d{2,3}-\d{1,}$/.test(val) && val.length >= 8
			},
			message: props => `${props.value} is not a valid phone number!`
		}
	},
	date: String
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)