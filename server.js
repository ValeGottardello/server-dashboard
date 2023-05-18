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
app.use(cors({
    origin: process.env.CLIENT,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.get('/', (req, res, next) => {
   res
    .json("hello")
})

app.post('/owner/signup', (req, res, next) => {

    const {name, email, password} = req.body

    if (name, email, password){
        Business.create(name,email,password)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.post('/owner/login', async (req, res, next) => {

    const { email, password } = req.body

    try {
        let owner = await Business.findByOne(email)

        if (owner.error) throw new Error ("Insert a valid email")
      
        let match = await bcrypt.compare(password, owner.password_digest)
        
        if (!match) throw new Error ("Insert a valid password")
    
        let token = createJsonWebToken(owner)
    
        res.json(token)
    
    } catch (err) {
        next(err)
    }
})

app.get('/owner', (req, res, next) => {

    let { id } = req.query
    id = Number(id)
    if (id) {
        Business
            .findName(id)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.get('/owner/alldependents', (req, res, next) => {

    let { id } = req.query
    id = Number(id)
    if (id) {
        Dependent
            .findAll(id)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.put('/owner/add/dependent', (req, res, next) => {

    let { id, position, email } = req.body
    id = Number(id)
    if (id) {
        Dependent
            .addDependentToBusiness(id, position, email)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.put('/owner/delete/dependent', async (req, res, next) => {
    let { email, position } = req.body

    try {
        let dependent = await Dependent.deleteDependentToBusiness(email, position)
        
        let token = createJsonWebToken(dependent)
    
        res.json(token)

    } catch (err) {

        next(err)
    } 
    
})

app.put('/owner/update/dependent', (req, res, next) => {
    let { position, email, id_business } = req.body


    if (email, position, id_business) {
        Dependent
            .updatePosition(position, email, id_business)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.post('/dependent/signup', (req, res, next) => {

    const {name, email, password} = req.body

    if (name, email, password){
        Dependent
            .create(name,email,password)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }

})

app.post('/dependent/login', async(req, res, next) => {

    const { email, password } = req.body
    try {
        let dependent = await Dependent.findByOne(email)
        
        if (dependent.error) throw new Error ("Insert a valid email")
        
        let match = await bcrypt.compare(password, dependent.password_digest)
        
        if (!match) throw new Error("Insert a valid password")
    
        let token = createJsonWebToken(dependent)
    
        res.json(token)

    } catch (err) {
        console.log(err)
        next(err)
    }
})

app.put('/dependent/addhours', async (req, res, next) => {

    let { hours_available, email } = req.body
    hours_available = Number(hours_available)

    try {
        let dependent = await Dependent.addHours(hours_available, email)
        
        let token = createJsonWebToken(dependent)
    
        res.json(token)

    } catch (err) {
        console.log(err)
        next(err)
    }    
})

app.get('/tasks/list', (req, res, next) => {

    let { id } = req.query

    id = Number(id)

    if (id) {
        Task
            .findAllForOne(id)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.get('/tasks/all', (req, res, next) => {

    let { id } = req.query

    id = Number(id)

    if (id) {
        Task
            .findAll(id)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.post('/tasks/new', (req, res, next) => {

    let { task_name, to_do, id_manager, id_employee, id_business, name_employee} = req.body

    id_manager = Number(id_manager)
    id_employee = Number(id_employee)
    id_business = Number(id_business)

    if (id_manager, id_employee, id_business) {
        Task
            .create(task_name, to_do, id_manager, id_employee,id_business, name_employee)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.put('/tasks/done', (req, res, next) => {

    let { id } = req.query
    id = Number(id)

    if (id) {
        Task
            .checkDone(id)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.delete('/tasks/delete', (req, res, next) => {

    let { id } = req.query
    id = Number(id)
    
    if (id) {
        Task
            .delete(id)
            .then(dbRes => res.json(dbRes))
            .catch(next)
    }
})

app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})
