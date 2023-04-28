const express = require("express")
const app = express()
const config = require("./config")
const bcrypt = require("bcrypt")
const errorHandler = require("./middlewares/error_handler.js")
const isLogged = require("./middlewares/is_logged.js")
const checkToken = require("./middlewares/check_token.js")
const createJsonWebToken = require("./utils/createJsonWebToken.js")
const Business = require('./models/business.js')

app.use(express.json()) 
app.use(checkToken)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res, next) => {
   res.json("hello")
})

app.post('/signup/owner', (req, res, next) => {

    const {name, email, password} = req.body
    // console.log(req.body)
    Business.create(name,email,password)
        .then(dbRes => res.json(dbRes))

})

app.post('/login/owner', async(req, res, next) => {

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

app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})