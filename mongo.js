const mongoose = require('mongoose')

if (process.argv.length < 3){
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://server:${password}@phonebook.iul5r.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({	
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length == 3){
	Person.find({})
		.then(result => {
			console.log("phonebook:")
			result.forEach(result => console.log(`${result.name} ${result.number}`))
			mongoose.connection.close()
		})
}else if(process.argv.length == 5){
	const name = process.argv[3]
	const number = process.argv[4]

	Person.create({
		name: name,
		number: number
	}).then(result => {
		console.log(`added ${result.name} number ${result.number} to phonebook`)
		mongoose.connection.close()
	})

}else{
	console.log(`Please provide the correct number of arguments: node mongo.js <password> <name> <number>`)
}


