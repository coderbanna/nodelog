var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            logmsg text, 
            title text, 
            domain text, 
            subdomain text,
            log_hash text
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    // var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
                    // db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                    // db.run(insert, ["user","user@example.com",md5("user123456")])
                }
            });
    }
});


module.exports = db