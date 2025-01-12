import {QueryBuilder} from "./builder.js";

const builder = new QueryBuilder()

const sql = `
    SELECT id, name, email
    FROM users
    WHERE age > 18 AND status = 'active'
    ORDER BY name ASC
    LIMIT 10;
`

const dynamicSql = builder
    .select(['id', 'name', 'email'])
    .from('users')
    .where('age > 18')
    .where('status = \'active\'')
    .build();

console.log(dynamicSql)