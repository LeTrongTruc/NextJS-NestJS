import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoveProductService } from './loveProduct.service';
import { LoveProduct, LoveProductSchema } from 'src/schemas/loveProduct.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoveProductController } from './loveProduct.controller';
import { Middleware } from 'src/middleware/middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LoveProduct.name, schema: LoveProductSchema }]),
    JwtModule.register({
      secret: 'sdfsdafs@3432!!!!',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [LoveProductService],
  exports: [LoveProductService],
  controllers: [LoveProductController]
})
export class LoveProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)
      .forRoutes(
        { path: '/loveProduct/loveProduct', method: RequestMethod.POST },
        { path: '/loveProduct/getListLoveProduct', method: RequestMethod.POST },
      )
  }
}
