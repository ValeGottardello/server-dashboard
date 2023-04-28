const db = require("../db")
const bcrypt = require("bcrypt")


class Dependent {
    static create (name,email,password) {
        const sql = `
            insert into dependents (name, email, password_digest)
            values ($1, $2, $3) returning *;
        `
        // console.log(name,email,password)
        return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => db.query(sql, [name, email, hash]))
            .then(res => {
                // console.log(res)
                return res.rows[0]})
    }

    static findByOne(email) {
        const sql = 'select * from dependents where email = $1;'
        return db.query(sql, [email])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    return res.rows[0]
                })
    }
}   

module.exports = Dependent 