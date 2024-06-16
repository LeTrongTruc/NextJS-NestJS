import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../schemas/product.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/schemas/user.schema';
import { RolesGuard } from 'src/auth/roles.guard';

interface ExtendedRequest extends Request {
  user: {
    _id: string;
  };
}

@Controller('/product')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Post('/createProduct')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create({ ...createProductDto, file });
  }

  @Post('/updateProduct')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update({ file, ...updateProductDto });
  }

  @Post('/search')
  async getProduct(@Body() data: any) {
    return this.productService.searchProduct(data);
  }

  @Post('detailProduct')
  async detailProduct(@Body() data: any, @Req() req: ExtendedRequest) {
    const _id = req.user ? req.user._id : null;

    return this.productService.detailProduct(data.id, _id);
  }

  @Post('getListProduct')
  async getListProduct(@Body() data: any, @Req() req: ExtendedRequest) {
    const _id = req.user ? req.user._id : null;
    return this.productService.getListProduct(_id, data.category,data.query);
  }
}
