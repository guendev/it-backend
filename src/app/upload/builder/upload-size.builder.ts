import { UploadSingleEnum } from '@app/upload/filter/upload-single.enum'

export interface IUploadSize {
  width?: number
  height?: number
}

export const UploadSizeBuilder = (endpoint: UploadSingleEnum): IUploadSize => {
  let size = {}
  switch (endpoint) {
    case UploadSingleEnum.product:
      size = {
        width: 500,
        height: 500
      }
      break
    case UploadSingleEnum.category:
      size = {
        width: 100,
        height: 100
      }
  }
  return size
}
