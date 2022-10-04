import { FileInterceptor } from '@nestjs/platform-express'
import { HttpException, HttpStatus } from '@nestjs/common'

export default FileInterceptor('image', {
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      cb(null, true)
    } else {
      return cb(
        new HttpException(
          'Only .png, .jpg and .jpeg format allowed!',
          HttpStatus.BAD_REQUEST
        ),
        false
      )
    }
  }
})
