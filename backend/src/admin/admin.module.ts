import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from 'src/search/search.module';
import { JwtModule } from '@nestjs/jwt';
import { Middleware } from 'src/middleware/middleware';
import { CategoryModule } from 'src/category/category.module';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ConfigModule,
    SearchModule,
    JwtModule.register({
      secret: 'sdfsdafs@3432!!!!',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
    CategoryModule,
    ProductModule,
    
  ],
  controllers: [AdminController],
  providers: [AdminService,CommonService]
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)
      .exclude({ path: 'admin/login', method: RequestMethod.ALL })
      .forRoutes('admin/*');
  }
}