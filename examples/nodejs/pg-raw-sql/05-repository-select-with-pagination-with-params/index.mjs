import pg from 'pg'
import {Repository} from "./repository.mjs";
const { Client } = pg
const client = new Client({
    user: 'postgres',
    password: 'it-incubator.io',
    host: 'localhost',
    port: 5433,
    database: 'BankSystem',
})
await client.connect()

const repo = new Repository(client);

const users = await repo.findAllUsers(2,0, true)
console.log(users)

await client.end()