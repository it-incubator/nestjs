import {Injectable, OnModuleInit} from '@nestjs/common';

import {drizzle, NodePgDatabase} from 'drizzle-orm/node-postgres';
import * as schema from '../../drizzle/schema';
import {withReplicas} from "drizzle-orm/pg-core";

@Injectable()
export class DbService implements OnModuleInit {
    private _db: NodePgDatabase<typeof schema>;
    private _primaryDb: NodePgDatabase<typeof schema>;
    private _readDb: NodePgDatabase<typeof schema>;

    async onModuleInit() {
        try {
            this._primaryDb = drizzle("postgresql://user:password@localhost:5435/postgres", {
                schema,
                logger: true,
            });

            this._readDb = drizzle("postgresql://user:password@localhost:5434/postgres", {
                schema,
                logger: true,
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