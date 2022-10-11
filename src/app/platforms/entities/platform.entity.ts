import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Technology } from '@app/technologies/entities/technology.entity'

export type PlatformDocument = Platform & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Platform {
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

  @Field(() => [Technology], { nullable: true, defaultValue: [] })
  children: Technology[]
}

export const PlatformEntity = SchemaFactory.createForClass(Platform)
