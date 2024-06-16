import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Login } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePassword } from './dto/changePassword.dto';
import { ForgotPassword } from './dto/forgotPassword.dto';
interface ExtendedRequest extends Request {
  user: {
    _id: string;
  };
}
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/createUser')
  async create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Post('/sendOTP')
  async sendOTP(@Body() data: { email: string }) {
    return this.userService.sendOTP(data);
  }

  @Post('/login')
  async login(@Body() data: Login) {
    return this.userService.login(data);
  }

  @Post('detail')
  async detail(@Req() req: ExtendedRequest) {
    const id = req.user._id;
    return this.userService.detail(id);
  }

  @Post('updateInfo')
  async updateInfo(
    @Req() req: ExtendedRequest,
    @Body() data: UpdateUserDto,
  ) {
    const id = req.user._id;
    return this.userService.updateInfo(id, data);
  }

  // Cập nhật avatar
  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExtendedRequest,
  ) {
    const id = req.user._id;
    return this.userService.uploadAvatar(id, file);
  }

  @Post('changePassword')
  async changePassword(
    @Req() req: ExtendedRequest,
    @Body() data: ChangePassword,
  ) {
    const id = req.user._id;
    return this.userService.changePassword(id, data);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() data: ForgotPassword) {
    return this.userService.forgotPassword(data);
  }

  @Post('sendOTPforgotPassword')
  async sendOTPforgotPassword(@Body() data: { email: string }) {
    return this.userService.sendOTPforgotPassword(data);
  }

  
}
