export class Repository {
    constructor(client) {
        this.client = client;
    }

    async findAllUsers(limit, offset, filters = {}) {
        let query = `
        SELECT *
        FROM public."Users"
    `;

        const params = [limit, offset];
        const conditions = [];

        if (filters.isMarried !== undefined) {
            conditions.push(`"IsMarried" = $${params.length + 1}`);
            params.push(filters.isMarried);
        }

        if (filters.passportNumber) {
            conditions.push(`"PassportNumber" ILIKE $${params.length + 1}`);
            params.push(`%${filters.passportNumber}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += `
        LIMIT $1
        OFFSET $2`;

        const res = await this.client.query(query, params);
        return res.rows;
    }

}