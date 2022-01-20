const { Pool } = require('pg')

const dbPool = new Pool({

    database : 'Personal-web',
    port : 5432,
    user : 'postgres',
    password : 'Kobong123'
    
})
console.log(Pool);
module.exports = dbPool