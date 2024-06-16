import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Login } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { OtpService } from 'src/otp/otp.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from 'src/common/common.service';
import { ChangePassword } from './dto/changePassword.dto';
import { ForgotPassword } from './dto/forgotPassword.dto';
import { AdminCreateUserDto } from './dto/adminCreateUser.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
    private readonly commonService: CommonService,
  ) { }

  // tạo tài khoản
  async create(data: CreateUserDto) {
    const { email, password, repassword, otp } = data;
    if (password !== repassword) {
      throw new BadRequestException('Please check repassword!');
    }
    const isEmailExist = await this.userModel.findOne({ email });

    if (isEmailExist) {
      throw new BadRequestException('Email is exists!');
    }

    const isVerifyOTP = await this.otpService.verifyOTP(otp, email);
    if (!isVerifyOTP) {
      throw new BadRequestException('OTP is not correct or expired!');
    }

    const createdUser = await this.userModel.create({
      email,
      password: this.createMd5(password),
    });

    const user = await this.userModel.findById(createdUser._id).lean().exec();

    const token = await this.generateToken(user);
    return {
      result: true,
      message: 'Create account success',
      token,
      user,
    };
  }

  // send otp
  async sendOTP(data: { email: string }) {
    if (!data.email) {
      throw new BadRequestException('Missing email');
    }

    const isEmailExist = await this.userModel.findOne({ email: data.email });

    if (isEmailExist) {
      throw new BadRequestException('Email đã được sử dụng!');
    }
    const otp = this.generateOTP();
    const content = `Mã OTP của bạn là ${otp}`;
    this.otpService.createOTP({ email: data.email, OTP: otp });
    this.sendMail(data.email, 'Send OTP verify account', content, '');

    return {
      message: 'success',
      status: 200,
      result: true,
    };
  }

  // send mail
  async sendMail(to: string, subject: string, text: string, html: string) {
    await this.mailerService
      .sendMail({
        to,
        subject,
        text,
        html,
      })
      .then(() => {
        console.log('Mail sent');
      })
      .catch((e) => {
        console.log('Mail not sent', e);
      });
  }

  // tạo otp
  public generateOTP() {
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return Number(result);
  }

  // tạo mật khẩu md5
  private createMd5(password: string): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // kiểm tra mật khẩu
  private verifyPassword(
    inputPassword: string,
    hashedPassword: string,
  ): boolean {
    const md5Hash = crypto
      .createHash('md5')
      .update(inputPassword)
      .digest('hex');
    return md5Hash === hashedPassword;
  }

  // hàm tạo token
  private generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  // hàm đăng nhập
  public async login(data: Login): Promise<object> {
    const hashedPassword = this.createMd5(data.password);

    const isAccountExist = await this.userModel
      .findOne({ email: data.email, password: hashedPassword }, { password: 0 })
      .lean()
      .exec();
    if (!isAccountExist)
      throw new NotFoundException('Tài khoản hoặc mật khẩu không chính xác');

    if (isAccountExist.status === 'block') {
      throw new NotAcceptableException('Tài khoản của bạn đã bị khoá')
    }

    if (isAccountExist.avatar)
      isAccountExist.avatar = `${process.env.URL_BACKEND}${isAccountExist.avatar}`;

    const token = await this.generateToken(isAccountExist);
    return { result: true, token, data: isAccountExist };
  }

  // detail
  public async detail(id: string): Promise<object> {
    if (!id) {
      throw new BadRequestException('missing id');
    }

    const data = await this.userModel.findById(id).lean().exec();
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

    const isUpdate = await this.userModel.findByIdAndUpdate(id, objectUpdate, {
      new: true,
    });

    if (!isUpdate) {
      throw new NotFoundException('not found account');
    }

    return { result: true, data: isUpdate };
  }

  // update avatar
  public async uploadAvatar(id: string, file: any): Promise<object> {
    if (!id || !file) {
      throw new BadRequestException('missing input');
    }

    const time = new Date().getTime();
    const isUpload = await this.commonService.uploadFile(
      file,
      time,
      `avatar/${id}`,
    );
    if (!isUpload) {
      throw new NotAcceptableException('Định dạng file không hợp lệ');
    }
    const updateAvatar = await this.userModel.findByIdAndUpdate(id, {
      avatar: isUpload,
    });
    if (!updateAvatar) {
      throw new BadRequestException('Cập nhật avatar thất bại');
    }

    return { result: true, data: `${process.env.URL_BACKEND}${isUpload}` };
  }

  // change password
  public async changePassword(
    id: string,
    data: ChangePassword,
  ): Promise<object> {
    const hashedPassword = this.createMd5(data.password);

    if (!id) {
      throw new BadRequestException('missing id');
    }

    const isAccountExist = await this.userModel.findById(id).lean();
    if (!isAccountExist) {
      throw new NotFoundException('not found account');
    }

    if (isAccountExist.password !== hashedPassword) {
      throw new BadRequestException('password old is not correct');
    }

    if (data.newPassword !== data.reNewPassword) {
      throw new BadRequestException('please check re new password');
    }

    const isUpdate = await this.userModel.findByIdAndUpdate(id, {
      password: this.createMd5(data.newPassword),
    });
    if (!isUpdate) {
      throw new BadRequestException('error from server');
    }

    return { result: true };
  }

  // forgot password
  public async sendOTPforgotPassword(data: { email: string }): Promise<object> {
    if (!data.email) {
      throw new BadRequestException('missing email');
    }

    const isEmailExist = await this.userModel.findOne({ email: data.email });

    if (!isEmailExist) {
      throw new NotFoundException('not found account!');
    }
    const otp = this.generateOTP();
    const content = `Mã OTP của bạn là ${otp}`;
    this.otpService.createOTP({ email: data.email, OTP: otp });
    this.sendMail(data.email, 'Send OTP verify account', content, '');

    return {
      message: 'success',
      status: 200,
      result: true,
    };
  }

  // change password
  public async forgotPassword(data: ForgotPassword): Promise<object> {
    if (data.newPassword !== data.reNewPassword) {
      throw new BadRequestException('please check re new password');
    }

    const hashedPassword = this.createMd5(data.newPassword);

    const isVerifyOTP = await this.otpService.verifyOTP(data.otp, data.email);
    if (!isVerifyOTP) {
      throw new BadRequestException('OTP is not correct or expired!');
    }

    const isUpdate = await this.userModel
      .findOneAndUpdate(
        { email: data.email },
        { password: hashedPassword },
        { new: true },
      )
      .lean()
      .exec();
    if (!isUpdate) {
      throw new BadRequestException('error from server');
    }

    isUpdate.password = undefined;
    if (isUpdate.avatar)
      isUpdate.avatar = `${process.env.URL_BACKEND}${isUpdate.avatar}`;
    const token = await this.generateToken(isUpdate);
    return { result: true, data: isUpdate, token };
  }

  // list user
  public async listUser(
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
          { birthday: new RegExp(key, 'i') },
        ]
      }
    }
    const data = await this.userModel
      .find(conditions)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    data.forEach(
      (item) => (item.avatar = `${process.env.URL_BACKEND}${item.avatar}`),
    );

    const count = await this.userModel.countDocuments(conditions);

    return {
      count,
      data,
      result: true,
    };
  }

  // create user
  public async createUser(data: AdminCreateUserDto) {
    const isEmailExist = await this.userModel.findOne({ email: data.email });

    if (isEmailExist) {
      throw new BadRequestException('Email is exists!');
    }

    await this.userModel.create({
      email: data.email,
      password: this.createMd5(data.password.toString()),
      username: data.username,
    });

    return {
      result: true,
      message: 'Create account success',
    };
  }

  public async deleteUser(data: string | string[]): Promise<any> {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new BadRequestException('Invalid parameters');
    }

    const idsToDelete = Array.isArray(data) ? data : [data];

    const objectIdsToDelete = idsToDelete.map((id) => new ObjectId(id));

    const deleteResult = await this.userModel.deleteMany({
      _id: { $in: objectIdsToDelete },
    });

    return {
      result: true,
      deletedCount: deleteResult.deletedCount,
    };
  }
}
