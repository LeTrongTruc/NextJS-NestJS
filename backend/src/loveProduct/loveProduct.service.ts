import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoveProduct } from 'src/schemas/loveProduct.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { ObjectId } from 'mongodb';

@Injectable()
export class LoveProductService {
  constructor(
    @InjectModel(LoveProduct.name)
    private readonly LoveProductModel: Model<LoveProduct>,
  ) { }
  public async findLoveProduct(_id: string, arr: Array<string>) {
    const data = await this.LoveProductModel.find(
      { idUser: _id, idProduct: { $in: arr } },
      { idProduct: 1, _id: 0 },
    ).lean();
    return data;
  }

  public async findLoveProductByUser(_id: string) {
    const data = await this.LoveProductModel.find(
      { idUser: _id },
      { idProduct: 1 },
    ).lean();
    const arr = data.map(item => item.idProduct)
    return arr;
  }

  public async loveProduct(conditions) {
    const isLoveProductExist = await this.LoveProductModel.findOne(conditions).lean();
    const query = isLoveProductExist ?
      await this.LoveProductModel.deleteOne(conditions) :
      await this.LoveProductModel.create(conditions);

    return {
      result: true,
      data: !!isLoveProductExist
    }
  }

  public async getListLoveProduct(_id: string, skip: number = 0, limit: number = 3) {
    const data = await this.LoveProductModel.aggregate([
      { $match: { idUser: _id } },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          let: { idProduct: { $toObjectId: '$idProduct' } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$idProduct']
                }
              }
            }
          ],
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    const count = await this.LoveProductModel.countDocuments({ idUser: _id })
    return {
      data,
      count,
      result: true,
    }
  }
}
