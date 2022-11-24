import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { User, UserDocument } from '@app/users/entities/user.entity'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'

export type CommentDocument = Comment & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Comment {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true, trim: true })
  content: string

  @Field(() => Int)
  @Prop({ type: Number, required: true })
  rate: number

  @Field(() => User)
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: UserDocument | Types.ObjectId

  @Field(() => Project)
  @Prop({ required: true, type: Types.ObjectId, ref: Project.name })
  project: ProjectDocument | Types.ObjectId

  @Field(() => Comment, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: Comment.name })
  parent: CommentDocument | Types.ObjectId

  @Field(() => Number)
  @Prop({ required: true, type: Number, index: true })
  createdAt: number
}

export const CommentEntity = SchemaFactory.createForClass(Comment)
