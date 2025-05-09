import {Injectable, OnModuleInit} from '@nestjs/common';

import {drizzle, PostgresJsDatabase} from 'drizzle-orm/postgres-js';
import * as schema from '../../drizzle/schema';
import {withReplicas} from "drizzle-orm/pg-core";
import * as postgres from "postgres";

const clientWrite = postgres("postgresql://localhost:5435,localhost:5434/postgres", {
    target_session_attrs: 'read-write',
    username: "user",
    password: 'password'
})
const clientRead = postgres("postgresql://localhost:5435,localhost:5434/postgres", {
    username: "user",
    password: 'password',
    target_session_attrs: 'prefer-standby',
})

@Injectable()
export class DbService implements OnModuleInit {
    private _db: PostgresJsDatabase<typeof schema>;
    private _primaryDb: PostgresJsDatabase<typeof schema>;
    private _readDb: PostgresJsDatabase<typeof schema>;

    async onModuleInit() {
        try {
            this._primaryDb = drizzle({
                schema,
                logger: true,
                client: clientWrite,
            });


            this._readDb = drizzle({
                schema,
                logger: true,
                client: clientRead
            });

            this._db = withReplicas(this._db, [this._readDb]);



            console.log('Database connected successfully');
        } catch (error) {
            console.error('Failed to connect to the database', error);
            throw error;
        }

    }

    get primaryDb() {
        return this._primaryDb
    }

    get readDb() {
        return this._readDb
    }

    get db() {
        return this._db
    }
}