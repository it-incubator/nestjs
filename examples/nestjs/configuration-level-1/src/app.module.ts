// import of this config module must be on the top of imports
import { configModule } from './dynamic-config-module';
import { UsersModule } from './modules/users/users.module';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { PaymentModule } from './modules/payment/payment.module';

import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { CoreConfig } from './core/core.config';

@Module({
  imports: [
    CoreModule,
    // настройку данного модуля вынесли в самый вверх файла, чтобы всё-таки если понадобится где-то обращаться к
    // process.env, чтобы там были переменные, которые в том числе проинициализируются
    // через env файлы
    configModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  static async forRoot(coreConfig: CoreConfig): Promise<DynamicModule> {
    // такой мудрёный способ мы используем, чтобы добавить к основным модулям необязательный модуль.
    // чтобы не обращаться в декораторе к переменной окружения через process.env в декораторе, потому что
    // запуск декораторов происходит на этапе склейки всех модулей до старта жизненного цикла самого NestJS
    const modules: any[] = [
      PaymentModule,
      UsersModule,
      MongooseModule.forRootAsync({
        // если CoreModule не глобальный, то явно импортируем в монгусовский модуль, иначе CoreConfig не заинджектится
        imports: [CoreModule],
        useFactory: (coreConfig: CoreConfig) => {
          // используем DI чтобы достать mongoURI контролируемо
          return {
            uri: coreConfig.mongoURI,
          };
        },
        inject: [CoreConfig],
      }),
    ];

    if (coreConfig.includeTestingModule) {
      modules.push(TestingModule);
    }

    return {
      module: AppModule,
      imports: modules, // Add dynamic modules here
    };
  }
}
