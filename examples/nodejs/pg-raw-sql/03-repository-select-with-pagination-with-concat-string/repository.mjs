export class Repository {
    constructor(client) {
        this.client = client;
    }

    async findAllUsers(limit, offset) {
        const queryString = `
            SELECT *
            FROM public."Users"
            LIMIT ${limit}
            OFFSET ${offset}`;

        const res = await this.client.query(queryString);
        return res.rows;
    }
}