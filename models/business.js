const db = require("../db")
const bcrypt = require("bcrypt")


class Business {
    static create (name,email,password) {
        const sql = `
            insert into business (name, owner_email, password_digest)
            values ($1, $2, $3) returning *;
        `
        return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => {
                return db.query(sql, [name, email, hash])})
            .then(res => res.rows[0])
    }

    static findByOne(email) {
        const sql = 'select * from business where owner_email = $1;'
        return db.query(sql, [email])
                .then(res => {
                    if (res.rows.length === 0){
                        return { error: "record not found"}
                    }
                    return res.rows[0]
                })
    }
    static findName (id) {
        const sql = 'select * from business where id = $1;'
        return db.query(sql, [id])
                .then(res => {
                    if (res.rows.length === 0) {
                        throw new Error("The business does not have a valid account anymore")
                    }
                    delete res.rows[0].password_digest
                    return res.rows[0]
                        
                })
    }

}   

module.exports = Business