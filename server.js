const express = require("express")
const app = express()
const config = require("./config")
const bcrypt = require("bcrypt")
const errorHandler = require("./middlewares/error_handler.js")
const isLogged = require("./middlewares/is_logged.js")
const checkToken = require("./middlewares/check_token.js")
const createJsonWebToken = require("./utils/createJsonWebToken.js")
const Business = require('./models/business.js')
const Dependent = require("./models/dependent")
const Task = require('./models/task')
const cors = require('cors');

app.use(express.json()) 
app.use(checkToken)

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/', (req, res, next) => {
   res.json("hello")
})

app.post('/owner/signup', (req, res, next) => {

    const {name, email, password} = req.body
    // console.log(req.body)
    Business.create(name,email,password)
        .then(dbRes => res.json(dbRes))

})

app.post('/owner/login', async(req, res, next) => {

    const { email, password } = req.body
    try {
        let owner = await Business.findByOne(email)
        
        
        console.log(password, owner)
        let match = await bcrypt.compare(password, owner.password_digest)
        
        if (!match) throw new Error("invalid email or password")
    
        let token = createJsonWebToken(owner)
    
        res.json(token)

    } catch (err) {
        console.log(err)
        next(err)
    }
})

app.get('/owner/alldependents', (req, res, next) => {

    let { id } = req.query
    id = Number(id)
    Dependent.findAll(id)
        .then(dbRes => res.json(dbRes))
})

app.put('/owner/add/dependent', (req, res, next) => {

    let { id, position, email } = req.body
    id = Number(id)
    // console.log(id,position,email)
    Dependent.addDependentToBusiness(id, position, email)
        .then(dbRes => res.json(dbRes))
})

app.put('/owner/delete/dependent', (req, res, next) => {
    let { email, position } = req.body
// console.log(email,position)
    Dependent.deleteDependentToBusiness(email, position)
        .then(dbRes => res.json(dbRes))
})

app.put('/owner/update/dependent', (req, res, next) => {
    let { position, email, id_business } = req.body

// console.log(req.body)
    Dependent.updatePosition(position, email, id_business)
        .then(dbRes => res.json(dbRes))
})
app.post('/dependent/signup', (req, res, next) => {

    const {name, email, password} = req.body
    // console.log(req.body)
    Dependent.create(name,email,password)
        .then(dbRes => res.json(dbRes))

})

app.post('/dependent/login', async(req, res, next) => {

    const { email, password } = req.body
    try {
        let dependent = await Dependent.findByOne(email)
        
        // console.log(password, dependent)
        let match = await bcrypt.compare(password, dependent.password_digest)
        
        if (!match) throw new Error("invalid email or password")
    
        let token = createJsonWebToken(dependent)
    
        res.json(token)

    } catch (err) {
        console.log(err)
        next(err)
    }
})


app.put('/dependent/addhours', (req, res, next) => {

    let { hours_available, email } = req.body
    hours_available = Number(hours_available)
    Dependent.addHours(hours_available, email)
        .then(dbRes => res.json(dbRes))
})


app.get('/tasks/list', (req, res, next) => {

    let { id } = req.query

    id = Number(id)
    console.log(id)

    Task.findAllForOne(id).then(dbRes => res.json(dbRes))
})

app.post('/tasks/new', (req, res, next) => {

    let { task_name, to_do, id_manager, id_employee} = req.body

    id_manager = Number(id_manager)
    id_employee = Number(id_employee)

    console.log(req.body)
    
    Task.create(task_name, to_do, id_manager, id_employee).then(dbRes => res.json(dbRes))
})

app.put('/tasks/done', (req, res, next) => {

    let { id } = req.query
    id = Number(id)
    console.log(id)
    Task.checkDone(id).then(dbRes => res.json(dbRes))
})


app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})
