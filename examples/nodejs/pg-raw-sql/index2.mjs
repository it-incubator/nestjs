import pg from 'pg'
const { Client } = pg
const client = new Client({
    user: 'postgres',
    password: 'it-incubator.io',
    host: 'localhost',
    port: 5433,
    database: 'BankSystem',
})
await client.connect()

let id = 1;

const res = await client.query(`
SELECT * 
FROM public."Users"
WHERE "Id" = ${id}
`)
console.log(res.rows) // Hello world!
await client.end()