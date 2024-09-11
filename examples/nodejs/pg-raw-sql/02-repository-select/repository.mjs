export class Repository {
    constructor(client) {
        this.client = client;
    }

    async findAllUsers() {
        let query = `
             SELECT *
             FROM public."Users"
        `;

        const res = await this.client.query(query)
        return res.rows
    }
}