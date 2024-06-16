import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { Login } from 'src/user/dto/login.dto';
import * as crypto from 'crypto';
import { AdminCreateUserDto } from 'src/user/dto/adminCreateUser.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CommonService } from 'src/common/common.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
  ) { }

  // login
  public async login(data: Login) {
    const hashedPassword = this.createMd5(data.password);

    const isAccountExist = await this.adminModel
      .findOne({ email: data.email, password: hashedPassword }, { password: 0 })
      .lean()
      .exec();
    if (!isAccountExist)
      throw new NotFoundException('Tài khoản hoặc mật khẩu không chính xác');

    if (isAccountExist.avatar)
      isAccountExist.avatar = `${process.env.URL_BACKEND}${isAccountExist.avatar}`;

    const token = await this.generateToken({
      ...isAccountExist,
      roles: 'admin',
    });
    return { result: true, token, data: isAccountExist };
  }

  // hàm tạo token
  private generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  // tạo mật khẩu md5
  private createMd5(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // list admin
  public async listAdmin(
    conditions: any = {},
    sort: any = { createdAt: -1 },
    limit: number = 10,
    skip: number = 0,
    key?: string
  ): Promise<object> {
    if (key) {
      conditions = {
        $or: [
          { username: new RegExp(key, 'i') },
          { email: new RegExp(key, 'i') },
          { status: new RegExp(key, 'i') },
          { phone: new RegExp(key, 'i') },
          { sex: new RegExp(key, 'i') },
          { role: new RegExp(key, 'i') },
        ]
      }
    }
    const data = await this.adminModel
      .find()
      .find(conditions)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    data.forEach(
      (item) => (item.avatar = `${process.env.URL_BACKEND}${item.avatar}`),
    );

    const count = await this.adminModel.countDocuments(conditions);

    return {
      count,
      data,
      result: true,
    };
  }

  public async createAdmin(data: AdminCreateUserDto) {
    const isEmailExist = await this.adminModel.findOne({ email: data.email });

    if (isEmailExist) {
      throw new BadRequestException('Email is exists!');
    }

    await this.adminModel.create({
      email: data.email,
      password: this.createMd5(data.password.toString()),
      username: data.username,
    });

    return {
      result: true,
      message: 'Create account success',
    };
  }

  // detail
  public async detail(id: string): Promise<object> {
    if (!id) {
      throw new BadRequestException('missing id');
    }

    const data = await this.adminModel.findById(id).lean().exec();
    if (!data) {
      throw new NotFoundException('not found account');
    }

    data.password = undefined;
    if (data.avatar) data.avatar = `${process.env.URL_BACKEND}${data.avatar}`;
    return { result: true, data };
  }

  // update
  public async updateInfo(
    id: string,
    data: UpdateUserDto,
    file?: any,
  ): Promise<object> {
    if (!id) {
      throw new BadRequestException('missing id');
    }
    const objectUpdate = { ...data };
    if (data.password) {
      objectUpdate.password = this.createMd5(data.password);
    }

    if (file) {
      const isUpload = await this.commonService.uploadFile(
        file,
        new Date().getTime(),
        `avatar/${id}`,
      );
      if (isUpload) {
        objectUpdate.avatar = isUpload.toString();
      }
    }

    const isUpdate = await this.adminModel.findByIdAndUpdate(id, objectUpdate, {
      new: true,
    });

    if (!isUpdate) {
      throw new NotFoundException('not found account');
    }

    return { result: true, data: isUpdate };
  }

  public async deleteAdmin(data: string | string[]): Promise<any> {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new BadRequestException('Invalid parameters');
    }

    const idsToDelete = Array.isArray(data) ? data : [data];

    const objectIdsToDelete = idsToDelete.map((id) => new ObjectId(id));

    const checkDelete = await this.adminModel.findOne({
      _id: { $in: objectIdsToDelete },
      role: 'root',
    });

    if (checkDelete) {
      throw new BadRequestException('Không thể xoá tài khoản root');
    }

    const deleteResult = await this.adminModel.deleteMany({
      _id: { $in: objectIdsToDelete }
    });

    return {
      result: true,
      deletedCount: deleteResult.deletedCount,
    };
  }
}
