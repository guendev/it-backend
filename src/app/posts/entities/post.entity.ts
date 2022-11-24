import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User, UserDocument } from '@app/users/entities/user.entity'

export type PostDocument = Post & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Post {
  @Field(() => ID)
  id: string

  @Field(() => User)
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: UserDocument | Types.ObjectId

  @Field()
  @Prop({ required: true, trim: true })
  content: string

  @Field(() => [String])
  @Prop({ default: [], type: [String], index: true })
  tags: string[]

  @Field(() => Number)
  @Prop({ required: true, type: Number, index: true })
  updatedAt: number

  @Field(() => Number)
  @Prop({ required: true, type: Number, index: true })
  createdAt: number
}

export const PostEntity = SchemaFactory.createForClass(Post)
