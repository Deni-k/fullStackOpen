require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('build'))
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(bodyParser.json())
app.use(cors())
morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body - :req[content-length]'))
const days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
app.get('/info',(req,res) => {
  const date = new Date()
  Person.find({}).then(persons => {
    if(date.getTimezoneOffset()<0){
      res.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT +${(date.getTimezoneOffset()/60)*-1}</p>`)
    }
    else{
      res.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT -${(date.getTimezoneOffset()/60)}</p>`)
    }
  })
})
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(!person){
      response.status(404).json({
        error: `ID ${request.params.id} not available`
      })
    }
    else{
      response.json(person.toJSON())
    }
  }).catch(error => {
    next(error)
  })
})
app.delete('/api/persons/:id', (request,response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    // eslint-disable-next-line no-undef
    .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request,response) => {
  const body = request.body
  // const id = Math.floor(Math.random() * 100000000);
  if(!body.name){
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  if(!body.number){
    return response.status(400).json({
      error: 'Number missing'
    })
  }
  // Person.find({name: body.name}).then(duplicate => {
  //     if(duplicate.length>=1)
  //     {
  //         return response.status(400).json({
  //             error: 'name must be unique'
  //         });
  //     }
  // else{
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save((error, savedPerson) => {
    if(error){
      return response.status(400).send({ error: error.message })
    }
    else{
      response.json(savedPerson.toJSON())
    }
  })
  // }
  // })

})
const errorHandler = (error, request, response, next) => {
  if(error.name ==='CastError' && error.kind === 'ObjectId'){
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
app.use(errorHandler)
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})