import { InputType, Field, ID, Int } from '@nestjs/graphql'
import { IsArray, IsNotEmpty, IsNumber, Min, MinLength } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'
import { PermissionEnum } from '@app/roles/enums/role.enum'

@InputType()
export class CreateRoleInput {
  @Field(() => String)
  @IsNotEmpty()
  @MinLength(1)
  name: string

  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  project: Types.ObjectId

  @Field(() => [PermissionEnum], {
    description: 'Mảng các quyền...mảng giao động từ 1'
  })
  @IsArray()
  permissions: PermissionEnum[]

  @Field(() => String, { nullable: true, defaultValue: '' })
  content: string

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsNumber()
  @Min(1)
  count: number
}
