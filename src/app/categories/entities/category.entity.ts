import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'

export type CategoryDocument = Category & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Category {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true, trim: true })
  name: string

  @Field()
  @Prop({ required: true, trim: true })
  avatar: string

  @Field(() => Boolean)
  @Prop({ default: false, index: true })
  primary: boolean

  @Field()
  @Prop({ slug: 'name', unique: true })
  slug: string

  @Field({ nullable: true, defaultValue: '' })
  @Prop({ default: '' })
  content: string
}

export const CategoryEntity = SchemaFactory.createForClass(Category)
