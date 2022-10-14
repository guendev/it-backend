import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'
import { StepStatus } from '@app/step/enums/project.status.enum'

export type StepDocument = Step & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Step {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true, trim: true })
  name: string

  @Prop({
    index: true,
    default: StepStatus.WAITING,
    type: String,
    enum: StepStatus
  })
  @Field(() => StepStatus, { defaultValue: StepStatus.WAITING })
  status: StepStatus

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

export const StepEntity = SchemaFactory.createForClass(Step)
