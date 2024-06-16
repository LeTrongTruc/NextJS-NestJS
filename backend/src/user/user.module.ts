import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { User, UserSchema } from "../schemas/user.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from '@nestjs-modules/mailer';
import { OTP, OTPSchema } from "src/schemas/otp.schema";
import { OtpService } from "src/otp/otp.service";
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from "src/common/common.service";
import { Middleware } from "src/middleware/middleware";
import { MiddlewareOption } from "src/middleware/middleware-option.middleware";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: OTP.name, schema: OTPSchema }
    ]),
    ConfigModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'letrongtruc.testweb@gmail.com',
          pass: 'dwef tzio bimt vqxs',
        },
      },
    }),
    JwtModule.register({
      secret: 'sdfsdafs@3432!!!!',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService, OtpService, CommonService],
  exports: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)
      .forRoutes(
        { path: '/user/detail', method: RequestMethod.POST },
        { path: '/user/updateInfo', method: RequestMethod.POST },
        { path: '/user/uploadAvatar', method: RequestMethod.POST },
        { path: '/user/changePassword', method: RequestMethod.POST },
      )
  }
}