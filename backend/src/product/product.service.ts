import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/product.schema';
import { Model } from 'mongoose';
import { ProductSearchService } from './productSearch.service';
import { CommonService } from 'src/common/common.service';
import { LoveProductService } from 'src/loveProduct/loveProduct.service';
import { ObjectId } from 'mongodb';
import { CategoryService } from 'src/category/category.service';
@Injectable()
export class ProductService {
  index = 'product';
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly productSearchService: ProductSearchService,
    private readonly commonService: CommonService,
    private readonly loveProductService: LoveProductService,
    private readonly categoryService: CategoryService

  ) { }

  async create(createProductDto: any): Promise<Object> {

    const time = new Date().getTime();

    if (!createProductDto.file) {
      throw new BadRequestException('Missing image');
    }

    const isUpload = await this.commonService.uploadFile(
      createProductDto.file,
      time,
      `product`,
    );
    if (!isUpload) {
      throw new NotAcceptableException('Định dạng file không hợp lệ');
    }

    const data = await this.productModel.create({
      ...createProductDto,
      image: isUpload,
    });

    await this.productSearchService.indexProduct({
      ...createProductDto,
      _id: data._id.toString(),
    });
    return { result: true };

  }

  async searchProduct(data: { key: string, skip: number, limit: number }) {

    const key = data.key || '';

    const skip = data.skip || 0;

    const limit = data.limit || 10;

    const results = await this.productSearchService.search(key, skip, limit);

    const ids = results ? results.map(result => new ObjectId(result)) : []
    if (ids.length === 0) {
      return {
        result: true,
        data: []
      }
    }

    const query = await this.productModel.find({ _id: { $in: ids } }).lean()

    query.forEach((item: any) => {
      if (item.image && !item.image.includes('http')) item.image = `${process.env.URL_BACKEND}${item.image}`;
    });

    const count = ids.length;
    return {
      count,
      result: true,
      data: query
    }

  }

  async deleteProduct(data: string | string[]) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new BadRequestException('Invalid parameters');
    }

    const idsToDelete = Array.isArray(data) ? data : [data];

    const objectIdsToDelete = idsToDelete.map(id => new ObjectId(id));

    const deleteResult = await this.productModel.deleteMany({ _id: { $in: objectIdsToDelete } });

    if (deleteResult.deletedCount == 0) {
      throw new BadRequestException('Không tìm thấy sản phẩm nào')
    }
    await this.productSearchService.deleteProduct(idsToDelete)

    return {
      result: true,
      deletedCount: deleteResult.deletedCount,
    };
  }

  async update(data: any): Promise<object> {
    let isUpload: string | boolean;

    if (data.file) {
      const time = new Date().getTime();
      isUpload = await this.commonService.uploadFile(
        data.file,
        time,
        `product`,
      );
      if (!isUpload) {
        throw new NotAcceptableException('Định dạng file không hợp lệ');
      }
    }

    const dataUpdate = { ...data };
    if (isUpload) {
      dataUpdate.image = isUpload;
    }

    const isUpdate = await this.productModel.findByIdAndUpdate(
      data._id,
      dataUpdate,
    );
    if (!isUpdate) {
      throw new NotFoundException('not found product');
    }

    const deletePropData = { ...data };
    delete deletePropData['_id'];

    await this.productSearchService.updateProduct(data._id, deletePropData);

    return { result: true };
  }

  async importProduct(data: any) {
    const length = data.length;
    const product = [];

    for (let i = 0; i < length; i++) {
      const Object: any = {};

      const element = data[i];

      if (
        !element.CategoryID ||
        !element.Name ||
        !element.Quantity ||
        !element.Image
      ) {
        throw new BadRequestException('Missing data parameters!');
      }
      Object.category_id = element.CategoryID;
      Object.name = element.Name;
      Object.detail = element.Detail;
      Object.specification = element.Specification;
      Object.standard = element.Standard;
      Object.unit = element.Unit;
      Object.quantity = element.Quantity;
      Object.image = element.Image;
      product.push(Object);
    }
    const requestInsert = await this.productModel.create(product);

    requestInsert.forEach((item) => (item._id = item._id.toString()));

    await this.productSearchService.indexProductImport(requestInsert);

    return { result: true };
  }

  public async listProduct(
    conditions: any = {},
    sort: any = { createdAt: -1 },
    limit: number = 10,
    skip: number = 0,
    key?: string
  ) {
    if (key) {
      conditions = {
        $or: [
          { category_id: new RegExp(key, 'i') },
          { name: new RegExp(key, 'i') },
          { specification: new RegExp(key, 'i') },
          { standard: new RegExp(key, 'i') },
          { unit: new RegExp(key, 'i') },
        ]
      }
    }
    const data = await this.productModel
      .find(conditions)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    data.forEach((item: any) => {
      if (item.image && !item.image.includes('http')) item.image = `${process.env.URL_BACKEND}${item.image}`;
    });
    const count = await this.productModel.countDocuments(conditions);

    return {
      data,
      count,
      result: true,
    };
  }

  async detailProduct(id: string, _id: string) {
    if (!id) throw new BadRequestException('Missing id');

    const data = await this.productModel.findById(id).lean().exec();

    if (!data) throw new NotFoundException('Not found product');

    const request = await this.categoryService.getCategoryForList({ _id: new ObjectId(data.category_id) })

    let loved = false;

    if (_id) {
      const isLovedProduct = await this.loveProductService.findLoveProduct(_id, [data._id])
      if (isLovedProduct.length !== 0) {
        loved = true;
      }
    }
    if (data.image && !data.image.includes('http')) data.image = `${process.env.URL_BACKEND}${data.image}`;
    return { data, result: true, category: request.data[0], loved };
  }

  public async getListProduct(_id: string, category?: string, query?: string) {
    const conditions: any = {};

    if (category) {
      const data = category.split('-')[1];
      conditions['category_id'] = data;
    }

    if (query) {
      conditions['name'] = new RegExp(query, 'i');
    }

    const data = await this.productModel.aggregate([
      { $match: conditions },
      {
        $group: {
          _id: "$category_id",
          totalProducts: { $sum: 1 },
          products: { $push: "$$ROOT" }
        }
      },
      { $match: { totalProducts: { $gt: 0 } } },
      {
        $lookup: {
          from: "categories",
          let: { categoryId: { $toObjectId: "$_id" } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$categoryId"]
                }
              }
            }
          ],
          as: "category"
        }
      },
      { $unwind: "$category" }
    ]);

    let lovedProducts = [];

    if (_id) {
      lovedProducts = await this.loveProductService.findLoveProductByUser(_id)
    }

    data.forEach(async (item: any) => {
      item.products.forEach(element => {
        element.loved = lovedProducts.includes(element._id.toString()) ? true : false;
        if (element.image && !element.image.includes('http')) element.image = `${process.env.URL_BACKEND}${element.image}`;
      })
    });

    return {
      data,
      result: true
    }
  }
}
