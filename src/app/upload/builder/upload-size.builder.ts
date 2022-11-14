import { UploadSingleEnum } from '@app/upload/filter/upload-single.enum'

export interface IUploadSize {
  width?: number
  height?: number
}

export const UploadSizeBuilder = (endpoint: UploadSingleEnum): IUploadSize => {
  let size = {}
  switch (endpoint) {
    case UploadSingleEnum.project:
      size = {
        width: 1000
      }
      break
    case UploadSingleEnum.category:
      size = {
        width: 100,
        height: 100
      }
      break
    case UploadSingleEnum.logo:
      size = {
        width: 100,
        height: 100
      }
  }
  return size
}
