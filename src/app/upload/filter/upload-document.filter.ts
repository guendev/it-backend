import { FileInterceptor } from '@nestjs/platform-express'
import { HttpException, HttpStatus } from '@nestjs/common'

export default FileInterceptor('document', {
  fileFilter: (req, file, cb) => {
    cb(null, true)
    // if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    //   cb(null, true)
    // } else {
    //   return cb(
    //     new HttpException('Format allowed!', HttpStatus.BAD_REQUEST),
    //     false
    //   )
    // }
  }
})
