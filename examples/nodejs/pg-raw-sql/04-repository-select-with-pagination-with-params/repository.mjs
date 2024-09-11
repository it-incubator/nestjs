export class Repository {
    constructor(client) {
        this.client = client;
    }

    async findAllUsers(limit, offset) {
        let queryString = `
         SELECT *
         FROM public."Users"
         LIMIT $1
         OFFSET $2
    `;
        const res = await this.client.query(queryString, [limit, offset]);

        return res.rows;
    }

}