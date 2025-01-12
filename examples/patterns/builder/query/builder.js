export class QueryBuilder {
    #columns = [];
    #tableName = null;
    #where = [];

    select(columns) {
        this.#columns = columns;
        return this;
    }

    addSelect(column) {
        this.#columns.push(column);
        return this;
    }

    from(tableName) {
            this.#tableName = tableName;
            return this;
    }

    where(condition) {
        this.#where.push(condition);
        return this;
    }

    build() {
        if (!this.#tableName) throw new Error('You must set table name');

        const sql = `
            SELECT ${this.#columns.length === 0 ? '*' : this.#columns.join(', ')}
            FROM ${this.#tableName}
            ${this.#where.length > 0 ? 'WHERE ' +  this.#where.join(' AND ') : ''}
            ORDER BY name ASC
            LIMIT 10;
`
        return sql;
    }
}