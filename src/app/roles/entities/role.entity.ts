import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'
import { PermissionEnum } from '@app/roles/enums/role.enum'

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
    type: [String],
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
  project: ProjectDocument

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  order: number

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  createdAt: number

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  updatedAt: number
}

export const RoleEntity = SchemaFactory.createForClass(Role)
