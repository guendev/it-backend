import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Platform,
  PlatformDocument
} from '@app/platforms/entities/platform.entity'

export type TechnologyDocument = Technology & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Technology {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true, trim: true })
  name: string

  @Field()
  @Prop({ slug: 'name', unique: true })
  slug: string

  @Field({ nullable: true, defaultValue: '' })
  @Prop({ default: '' })
  content: string

  @Prop({
    type: Types.ObjectId,
    ref: Platform.name,
    index: true
  })
  @Field(() => Platform)
  platform: PlatformDocument
}

export const TechnologyEntity = SchemaFactory.createForClass(Technology)
