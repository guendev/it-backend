import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'
import { PermissionEnum } from '@app/roles/enums/role.enum'
import { User, UserDocument } from '@app/users/entities/user.entity'

export type RoleDocument = Role & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Role {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true, trim: true })
  name: string

  // Meta data
  @Prop({
    index: true,
    default: [],
    type: [Number],
    enum: PermissionEnum
  })
  @Field(() => [PermissionEnum], { defaultValue: [] })
  permissions: PermissionEnum[]

  @Prop({
    type: Types.ObjectId,
    ref: 'projects',
    index: true
  })
  @Field(() => Project)
  project: ProjectDocument | Types.ObjectId

  // Người được phân quyền
  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, index: true })
  user: UserDocument | Types.ObjectId

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  order: number

  /**
   * the group field is created automatically on server every time a new role is created
   * roles create at the same time will have the same group
   * if adjust the role, the group will be changed
   */
  @Field(() => String, { nullable: true })
  @Prop({ type: String, index: true })
  group: string

  @Field(() => Float)
  @Prop({ required: true, type: Number, index: true })
  createdAt: number

  @Field(() => Float)
  @Prop({ required: true, type: Number, index: true })
  updatedAt: number
}

export const RoleEntity = SchemaFactory.createForClass(Role)
