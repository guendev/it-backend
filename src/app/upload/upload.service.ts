import { Injectable } from '@nestjs/common'
import { CreateUploadSingleDto } from './dto/create-upload-single.dto'

@Injectable()
export class UploadService {
  single(input: CreateUploadSingleDto) {
    return 'This action adds a new upload'
  }
}
