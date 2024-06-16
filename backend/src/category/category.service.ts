import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategory } from 'src/category/dto/createCategory.dto';
import { UpdateCategory } from 'src/category/dto/updateCategory.dto';
import { Category } from 'src/schemas/category.schema';
import { ObjectId } from 'mongodb';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    ) { }
    // create category
    public async createCategory(data: CreateCategory) {
        await this.categoryModel.create(data);
        return {
            result: true,
        }
    }

    public async updateCategory(data: UpdateCategory) {
        const isUpdate = await this.categoryModel.findByIdAndUpdate(data._id, data);
        if (!isUpdate) {
            throw new NotFoundException('not found category')
        }
        return {
            result: true,
        }
    }

    public async getCategoryFollowConditions(conditions: any) {
        if (conditions && conditions._id) {
            const request = await this.categoryModel.findById(conditions._id).lean().exec();
            return {
                result: true,
                data: request
            }
        }
        const request = await this.categoryModel.find(conditions).sort({ name: 1 }).lean().exec();
        return {
            result: true,
            data: request
        }
    }

    public async getCategoryForList(conditions: any = {}, skip: number = 0, limit: number = 5, key?: string) {
        if (key) {
            conditions = { name: new RegExp(key, 'i') }
          }
        const request: any = await this.categoryModel.find(conditions).sort({ name: 1 }).limit(limit).skip(skip).lean();
        const parentIds = request
            .filter(item => item.parent !== '0')
            .map(item => new ObjectId(item.parent));
        const parentCategories = await this.categoryModel.find({ _id: { $in: parentIds } }).lean();
        request.forEach(item => {
            if (item.parent !== '0') {
                const parentCategory = parentCategories.find(parent => parent._id.toString() === item.parent);
                if (parentCategory) {
                    item.parentData = parentCategory.name;
                }
            }
        });
        const count = await this.categoryModel.countDocuments({})
        return {
            count,
            result: true,
            data: request,
        }
    }

    public async deleteCategory(data: string | string[]): Promise<any> {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            throw new BadRequestException('Invalid parameters');
        }

        const idsToDelete = Array.isArray(data) ? data : [data];

        const objectIdsToDelete = idsToDelete.map(id => new ObjectId(id));

        const query = await this.categoryModel.aggregate([
            { $match: { _id: { $in: objectIdsToDelete } } },
            {
                $lookup: {
                    from: 'products',
                    let: { idCategory: { $toString: '$_id' } },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$category_id', '$$idCategory']
                                }
                            }
                        }
                    ],
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' }
        ])

        if (query.length !== 0) {
            throw new BadRequestException('Vẫn còn sản phẩm thuộc danh mục này')
        }

        const deleteResult = await this.categoryModel.deleteMany({ _id: { $in: objectIdsToDelete } });

        return {
            result: true,
            deletedCount: deleteResult.deletedCount,
        };
    }

    public async getCategoryForHome(conditions: any = {}, skip: number = 0, limit: number = 5) {

        const cate = [];

        const request: any = await this.categoryModel.find(conditions).sort({ name: 1 }).limit(limit).skip(skip).lean();

        const childCate = await Promise.all(request.map(item => (this.categoryModel.find({ parent: item._id.toString() }).lean())))

        for (let i = 0; i < request.length; i++) {
            const element = request[i];
            const object: any = { key: element._id.toString(), label: element.name }
            if (childCate[i].length !== 0) {
                object.children = [];
                childCate[i].map((item: any) => object.children.push({ key: `${item._id.toString()}`, label: item.name }))
            }
            cate.push(object)
        }
        return {
            result: true,
            data: cate,
        }
    }


}
