import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {UsersController} from "./users.controller";
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "./db/entities/user.entity";
import {Profile} from "./db/entities/profile.entity";
import {Category} from "./db/entities/category.entity";
import {Question} from "./db/entities/question.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5433,
            username: 'postgres',
            password: 'it-incubator.io',
            database: 'TypeOrmExample',
            autoLoadEntities: true,
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Profile,Category, Question])
    ],
    controllers: [UsersController],
    providers: [AppService],
})
export class AppModule {
}
