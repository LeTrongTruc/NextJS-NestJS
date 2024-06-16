import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Login } from 'src/user/dto/login.dto';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateCategory } from '../category/dto/createCategory.dto';
import { CategoryService } from 'src/category/category.service';
import { ProductService } from 'src/product/product.service';
import { UpdateCategory } from 'src/category/dto/updateCategory.dto';
import { UserService } from 'src/user/user.service';
import { AdminCreateUserDto } from 'src/user/dto/adminCreateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) { }

  @Post('login')
  async login(@Body() data: Login) {
    return this.adminService.login(data);
  }

  @Post('getCategoryFollowConditions')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async getCategory(@Body() data: any) {
    return this.categoryService.getCategoryFollowConditions(data.conditions);
  }

  @Post('getCategoryForList')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async getCategoryForList(@Body() data: any) {
    return this.categoryService.getCategoryForList(data.conditions, data.skip, data.limit, data.key);
  }

  @Post('createCategory')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async createCategory(@Body() data: CreateCategory) {
    return this.categoryService.createCategory(data);
  }

  @Post('deleteCategory')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteCategory(@Body() data: any) {
    return this.categoryService.deleteCategory(data._id);
  }

  @Post('updateCategory')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async updateCategory(@Body() data: UpdateCategory) {
    return this.categoryService.updateCategory(data);
  }

  @Post('importProduct')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async importProduct(@Body() data: any) {
    return this.productService.importProduct(data);
  }

  @Post('listProduct')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async listProduct(@Body() data: any) {
    return this.productService.listProduct(
      data.conditions,
      data.sort,
      data.limit,
      data.skip,
      data.key
    );
  }

  @Post('listUser')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async listUser(@Body() data: any) {
    return this.userService.listUser(
      data.conditions,
      data.sort,
      data.limit,
      data.skip,
      data.key
    );
  }

  @Post('listAdmin')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async listAdmin(@Body() data: any) {
    return this.adminService.listAdmin(
      data.conditions,
      data.sort,
      data.limit,
      data.skip,
      data.key
    );
  }

  @Post('createUser')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async createUser(@Body() data: AdminCreateUserDto) {
    return this.userService.createUser(data);
  }

  @Post('createAdmin')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async createAdmin(@Body() data: AdminCreateUserDto) {
    return this.adminService.createAdmin(data);
  }

  @Post('detailUser')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async detailUser(@Body() data: { id: string }) {
    return this.userService.detail(data.id);
  }

  @Post('detailAdmin')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async detailAdmin(@Body() data: { id: string }) {
    return this.adminService.detail(data.id);
  }

  @Post('deleteUser')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteUser(@Body() data: { _id: string }) {
    return this.userService.deleteUser(data._id);
  }

  @Post('updateInfo')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateInfo(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateUserDto,
  ) {
    const id = data._id;
    return this.userService.updateInfo(id, data, file);
  }

  @Post('updateInfoAdmin')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateInfoAdmin(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateUserDto,
  ) {
    const id = data._id;
    return this.adminService.updateInfo(id, data, file);
  }

  @Post('deleteAdmin')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteAdmin(@Body() data: { _id: string }) {
    return this.adminService.deleteAdmin(data._id);
  }

  @Post('deleteProduct')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async deleteProduct(@Body() data: { _id: string }) {
    return this.productService.deleteProduct(data._id);
  }
}
