import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from '@app/users/enum/role.enum'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { uidMiddleware } from '@app/users/middleware/uid.middleware'

export type UserDocument = User & Document

@Schema({
  toJSON: {
    virtuals: true,
    getters: true
  },
  toObject: {
    virtuals: true,
    getters: true
  }
})
@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Prop({ unique: true, index: true })
  @Field(() => String, {
    description: 'Firebase ID',
    middleware: [uidMiddleware]
  })
  uid: string

  @Prop({ required: true })
  @Field(() => String)
  name: string

  @Prop({ slug: 'name', unique: true, index: true })
  @Field(() => String)
  slug: string

  @Prop({ default: Role.USER, index: true })
  @Field(() => Role, { defaultValue: Role.USER })
  role: Role.USER

  @Prop()
  @Field(() => String, {
    nullable: true,
    defaultValue: 'https://i.imgur.com/pqGLgGr.jpg'
  })
  avatar: string

  @Prop()
  @Field(() => Float)
  createdAt: number
}

export const UserEntity = SchemaFactory.createForClass(User)
