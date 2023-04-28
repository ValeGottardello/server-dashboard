function errorHandler(err,req,res,next) {

    console.log(err)
    const { message, status = 500 } = err
    res.status(status).json({ status, message })

}

module.exports = errorHandler