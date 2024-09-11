export class Repository {
    constructor(client) {
        this.client = client;
    }

    async findAllUsers(limit, offset, isMarried = null) {
        let query = `
        SELECT *
        FROM public."Users"
    `;

        const params = [limit, offset];

        if (isMarried !== null) {
            query += ` WHERE "IsMarried" = $3`;
            params.push(isMarried);
        }

        query += `
        LIMIT $1
        OFFSET $2`;

        const res = await this.client.query(query, params);
        return res.rows;
    }
}