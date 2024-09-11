import {APP_GUARD, NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import {ThrottlerGuard, ThrottlerStorage} from "@nestjs/throttler";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //   const reflector = app.get(Reflector);
  // app.useGlobalGuards(new ThrottlerGuard({
  //     ttl: 30000,
  //     limit: 2,
  // }, new ThrottlerStorage(), reflector))

    app.use(cookieParser());

    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: true,
            name: 'session.courses.id',
            cookie: {
                maxAge: 3600000, // 1 hour
                httpOnly: true,  // Mitigates XSS attacks
                secure: false,   // Set to true if using HTTPS
                sameSite: 'lax' // Adjust as needed for your use case
            },
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Courses API')
        .setDescription('The courses API description')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);





  await app.listen(3001);
}
bootstrap();
