const db = require("../db")
const bcrypt = require("bcrypt")


class Dependent {
    static create (name,email,password) {
        const sql = `
            insert into dependents (name, email, password_digest)
            values ($1, $2, $3) returning *;
        `
        console.log(name,email,password)
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

    static findAll (id) {
        const sql = 'select * from dependents where id_business = $1;'
        return db.query(sql, [id])
                .then(res => {
                    if (res.rows.length === 0){
                        return res.rows
                    }
                    return res.rows.map(dependent => {
                        delete dependent.password_digest
                        return dependent} )
                }) 
    }

    static addDependentToBusiness (id_business, position, email) {

        const sql = 'UPDATE dependents SET id_business = $1, position = $2 WHERE email = $3 returning *;'
        
        return db.query(sql, [id_business, position, email])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    delete res.rows[0].password_digest
                    return res.rows[0]
                }) 
    }

    static addHours (hours_available, email) {

        const sql = 'UPDATE dependents SET hours_available = $1 WHERE email = $2 returning *;'
        
        return db.query(sql, [hours_available, email])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    delete res.rows[0].password_digest
                    return res.rows[0]
                }) 
    }

    
    static deleteDependentToBusiness (email, position) {

        const sql = `
        UPDATE dependents 
        SET id_business = 0, 
        position = 'unemployee' 
        WHERE email = $1 AND position = $2 
        returning *;`
        
        return db.query(sql, [email, position])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    delete res.rows[0].password_digest
                    return res.rows[0]
                }) 
    }

    static updatePosition (position, email, id_business) {
        const sql = `
        UPDATE dependents 
        SET position = $1 
        WHERE email = $2 AND id_business = $3 returning *;`
        
        return db.query(sql, [position, email, id_business])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    delete res.rows[0].password_digest
                    return res.rows[0]
                }) 
    }
}   

module.exports = Dependent 

