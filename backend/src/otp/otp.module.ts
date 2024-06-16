import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OTP, OTPSchema } from "src/schemas/otp.schema";
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])],
  providers: [OtpService, CommonService],
  exports: [OtpService]
})
export class OtpModule { }
