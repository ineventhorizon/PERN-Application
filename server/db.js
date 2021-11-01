const Pool = require("pg").Pool

const pool = new Pool({
    user: "postgres",
    password: "159951",
    host: "localhost",
    port: 5432,
    database: "proje"
})

module.exports = pool;