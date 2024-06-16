import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { SearchModule } from './search/search.module';
import { OtpModule } from './otp/otp.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { CategoryModule } from './category/category.module';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  MongooseModule.forRoot(process.env.DB_URI, {
    dbName: 'QLSP'
  }),
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'storage'),
  }),
    UserModule,
    ProductModule,
    CategoryModule,
    SearchModule,
    OtpModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
