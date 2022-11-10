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
import { ProjectStatus } from '@app/projects/enums/project.status.enum'
import { ProjectActive } from '@app/projects/enums/project.active.enum'
import { User, UserDocument } from '@app/users/entities/user.entity'

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

  @Field(() => String)
  @Prop({ type: String })
  cover: string

  @Field(() => String)
  @Prop({ type: String })
  logo: string

  @Field()
  @Prop({ slug: 'name', unique: true, index: true })
  slug: string

  // Chủ sở hữu
  @Field(() => User)
  @Prop({ type: Types.ObjectId, index: true, required: true })
  owner: UserDocument

  @Field({ nullable: true, defaultValue: '' })
  @Prop({ default: '' })
  content: string

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    index: true
  })
  @Field(() => Category)
  category: CategoryDocument | Types.ObjectId

  @Prop({
    type: [Types.ObjectId],
    index: true
  })
  @Field(() => [Technology])
  technologies: TechnologyDocument[]

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

  // Dự án đang chạy hay là chuẩn bị
  @Prop({
    index: true,
    default: ProjectStatus.PREPARE,
    type: Number,
    enum: ProjectStatus
  })
  @Field(() => ProjectStatus, { defaultValue: ProjectStatus.PREPARE })
  status: ProjectStatus

  // Dự án đang chạy hay là chuẩn bị
  @Prop({
    index: true,
    default: ProjectActive.DISABLED,
    type: Number,
    enum: ProjectActive
  })
  @Field(() => ProjectActive, { defaultValue: ProjectActive.DISABLED })
  active: ProjectActive

  // Graphql
  @Field(() => Float, { defaultValue: 0 })
  bookmarks: number

  // Graphql
  @Field(() => Float, { defaultValue: 0 })
  comments: number

  // GraphQL
  @Field(() => [Step], { defaultValue: [] })
  steps: StepDocument[]

  // GraphQL
  @Field(() => [Role], { defaultValue: [] })
  roles: RoleDocument[]
}

export const ProjectEntity = SchemaFactory.createForClass(Project)
