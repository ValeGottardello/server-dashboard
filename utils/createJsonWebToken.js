const jwt = require("jsonwebtoken")

function createJsonWebToken(data) {

    return jwt.sign(data, process.env.SECRET, { expiresIn: "60d" })
}

module.exports = createJsonWebToken
