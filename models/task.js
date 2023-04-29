const db = require("../db")

class Task {
    static create (task_name, to_do, id_employee, id_manager) {
        const sql = `
            insert into tasks (task_name, to_do, id_manager, id_employee)
            values ($1, $2, $3, $4) returning *;
        `
        return db.query(sql, [task_name, to_do, id_employee, id_manager])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    return res.rows
                })
    }

    static findAllForOne (id) {
        console.log(id)
        const sql = 'select * from tasks where id_employee = $1;'

        return db.query(sql, [id])
                .then(res => {
                    if (res.rows.length === 0){
                        throw new Error (404, 'record not found')
                    }
                    console.log(res.rows)
                    return res.rows
                }) 
    }
}

module.exports = Task