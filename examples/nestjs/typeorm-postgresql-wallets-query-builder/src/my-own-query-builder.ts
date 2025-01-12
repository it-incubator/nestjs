export class QueryBuilder {
    private tableName: string = "";
    private columns: string[] = [];
    private whereClauses: string[] = [];
    private orderByClause: string = "";
    private limitClause: string = "";
    private isCountQuery: boolean = false;

    select(columns: string[]): QueryBuilder {
        this.columns = columns;
        this.isCountQuery = false;
        return this;
    }

    from(tableName: string): QueryBuilder {
        this.tableName = tableName;
        return this;
    }

    where(condition: string): QueryBuilder {
        this.whereClauses.push(condition);
        return this;
    }

    orderBy(column: string, direction: "ASC" | "DESC" = "ASC"): QueryBuilder {
        this.orderByClause = `${column} ${direction}`;
        return this;
    }

    limit(count: number): QueryBuilder {
        this.limitClause = `LIMIT ${count}`;
        return this;
    }

    count(): QueryBuilder {
        this.isCountQuery = true;
        return this;
    }

    build(): string {
        if (!this.tableName) {
            throw new Error("Table name is required");
        }

        const columnsPart = this.isCountQuery ? "COUNT(*)" : (this.columns.length > 0 ? this.columns.join(", ") : "*");
        const wherePart = this.whereClauses.length > 0 ? `WHERE ${this.whereClauses.join(" AND ")}` : "";
        const orderByPart = !this.isCountQuery && this.orderByClause ? `ORDER BY ${this.orderByClause}` : "";

        return `SELECT ${columnsPart} FROM ${this.tableName} ${wherePart} ${orderByPart} ${this.limitClause}`.trim();
    }
}

// Example usage
const queryBuilder = new QueryBuilder();
queryBuilder
    .select(["id", "name", "email"])
    .from("users");

if (true) {
    queryBuilder.where("age > 18");
}
if (true) {
    queryBuilder.orderBy("name", "ASC")
}

const queryBuilder2 = new QueryBuilder()
    .select(["id", "name", "email"])
    .from("users")
    .where("age > 18")
    .where("status = 'active'")
    .orderBy("name", "ASC")
    .limit(10);

const sqlForFetchData = queryBuilder2.build()
const sqlForFetchCount = queryBuilder2.count().build()


const rawSql = `
    SELECT id, name, email
    FROM users
    WHERE age > 18
      AND status = 'active'
    ORDER BY name ASC LIMIT 10;
`