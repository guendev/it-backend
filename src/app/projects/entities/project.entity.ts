import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import {
  Category,
  CategoryDocument
} from '@app/categories/entities/category.entity'
import {
  Technology,
  TechnologyDocument
} from '@app/technologies/entities/technology.entity'
import { Step, StepDocument } from '@app/step/entities/step.entity'
import { Role, RoleDocument } from '@app/roles/entities/role.entity'

export type ProjectDocument = Project & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Project {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ required: true, trim: true })
  name: string

  @Field(() => [String])
  @Prop({ type: [String] })
  covers: string[]

  @Field()
  @Prop({ slug: 'name', unique: true })
  slug: string

  @Field({ nullable: true, defaultValue: '' })
  @Prop({ default: '' })
  content: string

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    index: true
  })
  @Field(() => Category)
  category: CategoryDocument

  @Prop({
    type: [Types.ObjectId],
    index: true
  })
  @Field(() => [Technology])
  technologies: TechnologyDocument[]

  @Field(() => [Step])
  steps: StepDocument[]

  @Field(() => [Role])
  roles: RoleDocument[]

  @Field(() => [String])
  @Prop({ type: [String] })
  files: string[]

  @Field(() => [Float, Float])
  @Prop({ type: [Number, Number], index: true })
  estimate: [number, number]

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  createdAt: number

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  updatedAt: number

  // Meta data
  // @Prop({
  //   index: true,
  //   default: ProjectStatus.ON_GOING,
  //   type: String,
  //   enum: ProjectStatus
  // })
  // @Field(() => ProjectStatus, { defaultValue: ProjectStatus.ON_GOING })
  // status: ProjectStatus
}

export const ProjectEntity = SchemaFactory.createForClass(Project)
