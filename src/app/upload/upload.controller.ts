import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import * as fs from 'fs'

import uploadSingleFilter from '@app/upload/filter/upload-single.filter'
import { UploadSingleEnum } from '@app/upload/filter/upload-single.enum'
import { UploadSizeBuilder } from '@app/upload/builder/upload-size.builder'
import { UploadNameBuilder } from '@app/upload/builder/upload-name.builder'
import { UploadFileBuilder } from '@app/upload/builder/upload-file.builder'
import { UploadService } from '@app/upload/upload.service'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(uploadSingleFilter)
  async single(
    @UploadedFile() file: Express.Multer.File,
    @Body('endpoint') endpoint: UploadSingleEnum,
    @Request() req
  ) {
    if (!file) {
      throw new Error('File not found')
    }

    const size = UploadSizeBuilder(endpoint)
    const name = UploadNameBuilder(endpoint, req.user)

    const resized = await UploadFileBuilder(file.buffer, size)

    const fullName = name.pathName + '/' + name.fileName
    // gi file
    fs.mkdirSync(`public${name.pathName}`, { recursive: true })
    fs.writeFileSync(`public${fullName}`, resized)

    return {}
  }
}
