import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,

    ) { }
    @Post('getCategoryForHome')

    async getCategoryForList(@Body() data: any) {
        return this.categoryService.getCategoryForHome({ ...data.conditions, parent: '0' }, data.skip);
    }
}
