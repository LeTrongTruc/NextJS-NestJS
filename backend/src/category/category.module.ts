import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}
