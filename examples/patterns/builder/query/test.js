import {QueryBuilder} from "./builder.js";

const sql = `
    SELECT id, name, email
    FROM users
    WHERE age > 18 AND status = 'active'
    ORDER BY name ASC
    LIMIT 10;
`
//console.log(sql)


const dto = {
    includes: {email: true},
    filters: {
        status: 'active',
        age: 12,
    },
    order: {
        by: 'name',
        direction: 'ASC'
    }
};

const where = [];
if (dto.filters.status) where.push(`status = \'${dto.filters.status}\'`);
if (dto.filters.age) where.push('age = ' + dto.filters.age);

const dynamicSql = `
    SELECT id, name ${dto.includes.email ? ', email' : ''}
    FROM users
    ${where.length > 0 ? 'WHERE ' + where.join(' AND ') : ''}
    ${dto.order.by ? `ORDER BY ${dto.order.by}` : ''} ${!!dto.order.direction ? dto.order.direction : ''}
    LIMIT 10;
`


// query builder
const builder = new QueryBuilder()
    .select(['id', 'name'])
    .from('users');

if (dto.includes.email) builder.addSelect('email')

if (dto.filters.status) builder.where(`status = \'${dto.filters.status}\'`);
if (dto.filters.age) builder.where('age = ' + dto.filters.age);
//if (dto.order.by)

const sql3 = builder.build();
console.log(sql3)

