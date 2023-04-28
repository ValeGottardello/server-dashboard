function isLogged(req, res, next) {
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" })
      return
    }
  
    next()
  }
  
module.exports = isLogged