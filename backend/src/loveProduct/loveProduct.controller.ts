import { Body, Controller, Post, Req } from '@nestjs/common';
import { LoveProductService } from './loveProduct.service';
interface ExtendedRequest extends Request {
    user: {
        _id: string;
    };
}
@Controller('loveProduct')
export class LoveProductController {
    constructor(
        private readonly loveProductService: LoveProductService,

    ) { }

    @Post('loveProduct')
    async loveProduct(@Body() data: any, @Req() req: ExtendedRequest) {
        const id = req.user._id;
        return this.loveProductService.loveProduct({ idUser: id, idProduct: data.id })
    }

    @Post('getListLoveProduct')
    async getListLoveProduct(@Body() data: any, @Req() req: ExtendedRequest) {
        const id = req.user._id;
        return this.loveProductService.getListLoveProduct(id, data.skip, data.limit)
    }
}
