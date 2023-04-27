const express = require("express")
const app = express()
const config = require("./config")

app.use(express.json()) 

app.get('/', (req, res, next) => {
    res.json("hello")
})


app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})