import { InputType, Int, Field } from '@nestjs/graphql'
import { Max, Min, IsNumber, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

@InputType()
export class FilterOffet {
  @Field(() => String, { description: 'Sắp xếp của bình luận' })
  @IsNotEmpty({ message: 'Sắp xếp là bắt buộc' })
  sort: string

  @Field(() => Int)
  @Type(() => Number)
  @IsNumber({}, { message: 'Giới hạn phải là số' })
  @Min(1, { message: 'Giới hạn quá nhỏ' })
  @Max(20, { message: 'Giới hạn quá lớn' })
  limit: number

  @Field(() => Int)
  @Type(() => Number)
  @IsNumber({}, { message: 'Giới hạn phải là số' })
  @Min(0, { message: 'Giới hạn quá nhỏ' })
  offset: number
}
