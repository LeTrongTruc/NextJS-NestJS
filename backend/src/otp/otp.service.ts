import { Injectable } from '@nestjs/common';
import { CreateOTP } from './dto/create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from 'src/schemas/otp.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class OtpService {
    constructor(@InjectModel(OTP.name) private readonly otpModel: Model<OTP>) { }
    async createOTP(data: CreateOTP) {
        const currentTime = moment(); 
        const expiredTime = currentTime.clone().add(5, 'minutes'); 
        const formattedExpiredTime = expiredTime.format();
        return await this.otpModel.create({
            ...data,
            expired: formattedExpiredTime
        });
    }

    async verifyOTP(otp: string, email: string) {
        const currentTime = moment().format(); 
        const request = await this.otpModel.findOne({ OTP: Number(otp), email, expired: { $gt: currentTime } });
        return !!request
    }
}
