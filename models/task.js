const db = require("../db")

class Task {
    static create (task_name, to_do, id_employee, id_manager, id_business, name_employee) {
        const sql = `
            insert into tasks (task_name, to_do, id_manager, id_employee, id_business, name_employee)
            values ($1, $2, $3, $4, $5, $6) returning *;
        `
        console.log(task_name, to_do, id_manager, id_employee)
        return db.query(sql, [task_name, to_do, id_employee, id_manager, id_business, name_employee])
                .then(res => {
                    return res.rows
                })
    }
    static findAllForOne (id) {

        console.log(id)
        const sql = `select * from tasks where id_employee = $1 and done = 'no';`

        return db.query(sql, [id])
                .then(res => {
                    if (res.rows.length === 0){
                        return {error: "record not found"}
                    }
                    return res.rows
                }) 
    }
    static findAll (id) {

        console.log(id)
        const sql = `select * from tasks where id_business = $1;`

        return db.query(sql, [id])
                .then(res => {
                    return res.rows
                }) 
    }
    static checkDone (id) {

        const sql = `UPDATE tasks SET done = 'yes' WHERE id = $1 returning *;`

        return db.query(sql, [id])
                .then(res => {
            
            return res.rows[0]
        }) 
    }
    static delete (id) {

        const sql = `delete from tasks WHERE id = $1 returning *;`

        return db.query(sql, [id])
                .then(res => {
            return res.rows[0]
        }) 
    }
}

module.exports = Task