const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
app.use(bodyParser.json());
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body - :req[content-length]'));
let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "3923-64-23122",
        id: 4
    }
]
const days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
app.get('/info',(req,res) => {
    const date = new Date();
    if(date.getTimezoneOffset()<0){
        res.send(`<p>Phonebook has info for ${persons.length} people</p>
                <p>${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} GMT +${(date.getTimezoneOffset()/60)*-1}</p>`);
    }
            })
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if(person){
        response.json(person);
    }
    else{
        return response.status(404).json({
            error: `ID ${id} not available`
        });
    }
});
app.delete('/api/persons/:id', (request,response) =>{
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);
  response.status(204).end()
})
app.post('/api/persons', (request,response) => {
    const body = request.body;
    const id = Math.floor(Math.random() * 100000000);
    if(!body.name){
        return response.status(400).json({
            error: 'Name missing'
        });
    }
    if(!body.number){
        return response.status(400).json({
            error: 'Number missing'
        });
    }
    const duplicate = persons.filter((person) => person.name === body.name);
    if(duplicate.length>=1){
        return response.status(400).json({
            error: 'name must be unique'
        });
    }
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person);
    response.json(person);
})
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})