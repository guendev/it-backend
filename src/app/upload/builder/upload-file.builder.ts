import sharp from 'sharp'

import { IUploadSize } from '@app/upload/builder/upload-size.builder'

export const UploadFileBuilder = async (image: any, size: IUploadSize) => {
  return sharp(image)
    .png({})
    .resize(size.width, size.height, { fit: 'cover' })
    .toBuffer()
}
