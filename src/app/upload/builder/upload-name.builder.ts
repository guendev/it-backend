import { v4 as uuidv4 } from 'uuid'

import { UserDocument } from '@app/users/entities/user.entity'

export interface IUploadName {
  pathName: string
  fileName: string
}

export const UploadNameBuilder = (
  group: string,
  endpoint: string,
  user: UserDocument
): IUploadName => {
  return {
    pathName: `/${group}/users/${user._id}/${endpoint}`,
    fileName: `${uuidv4()}.png`
  }
}
