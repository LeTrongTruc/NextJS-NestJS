import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSearchService } from './productSearch.service';
import { CommonService } from 'src/common/common.service';
import { Middleware } from 'src/middleware/middleware';
import { MiddlewareOption } from 'src/middleware/middleware-option.middleware';

import { Product, ProductSchema } from '../schemas/product.schema';
import { Category, CategorySchema } from '../schemas/category.schema';

import { SearchModule } from 'src/search/search.module';
import { LoveProductModule } from 'src/loveProduct/loveProduct.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ConfigModule,
    SearchModule,
    LoveProductModule,
    CategoryModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ConfigService, JwtService, ProductSearchService, CommonService],
  exports: [ProductService]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)
      .forRoutes(
        { path: 'product/createProduct', method: RequestMethod.ALL },
        { path: 'product/updateProduct', method: RequestMethod.ALL }
      )
      .apply(MiddlewareOption)
      .forRoutes({ path: 'product/getListProduct', method: RequestMethod.POST },
        { path: 'product/detailProduct', method: RequestMethod.POST }
      );
  }
}
