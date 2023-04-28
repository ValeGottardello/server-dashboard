function checkToken(req, res, next) {
   
    let token = req.get("Authorization") || req.query.token
  
    if (token) {
      token = token.replace("Bearer ", "")
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        console.log("verify", err)
        console.log(decoded)
        req.user = err ? null : decoded
        return next()
      })
    } else {
      req.user = null
      next()
    }
}

module.exports = checkToken