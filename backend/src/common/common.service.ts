import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class CommonService {
    getTime() {
        return moment()
    }
    formatTime(time?: any) {
        return moment(time).format('MMMM Do YYYY, h:mm:ss a')
    }
    public async uploadFile(file: any, time: number, pathFolder: string, type?: number) {
        try {
            const path1 = `./storage/pictures/${pathFolder}/`;
            const filePath = `./storage/pictures/${pathFolder}/${time}_${file.originalname}`;
            const fileCheck = path.extname(filePath);

             if (!['.jpg', '.png'].includes(fileCheck.toLocaleLowerCase())) {
                return false;
            }
            if (!fs.existsSync(path1)) {
                fs.mkdirSync(path1, { recursive: true });
            }
            fs.writeFileSync(filePath, file.buffer);
            return `/pictures/${pathFolder}/${time}_${file.originalname}`;
        } catch (error) {
            throw new BadRequestException('Có lỗi xảy ra')
        }
    }
}