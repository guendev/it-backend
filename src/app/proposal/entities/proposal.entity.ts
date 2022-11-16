import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { User, UserDocument } from '@app/users/entities/user.entity'
import { Role, RoleDocument } from '@app/roles/entities/role.entity'
import { ProposalStatus } from '@app/proposal/enums/proposal.enum'
import { Project, ProjectDocument } from '@app/projects/entities/project.entity'

export type ProposalDocument = Proposal & Document

@ObjectType()
@Schema({
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})
export class Proposal {
  @Field(() => ID)
  id: string

  @Field()
  @Prop({ default: '' })
  letter: string

  @Field()
  @Prop({ default: '' })
  resume: string

  @Field()
  @Prop({ default: '' })
  note: string

  @Prop({
    type: Types.ObjectId,
    index: true
  })
  @Field(() => Project)
  project: ProjectDocument | Types.ObjectId

  @Prop({
    type: Types.ObjectId,
    index: true
  })
  @Field(() => Role)
  role: RoleDocument | Types.ObjectId

  // Dự án đang chạy hay là chuẩn bị
  @Prop({
    index: true,
    default: ProposalStatus.WAITING,
    type: Number,
    enum: ProposalStatus
  })
  @Field(() => ProposalStatus, { defaultValue: ProposalStatus.WAITING })
  status: ProposalStatus

  // Người được phân quyền
  @Field(() => User, { nullable: true })
  @Prop({ type: Types.ObjectId, index: true })
  user: UserDocument | Types.ObjectId

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  createdAt: number

  @Field(() => Float)
  @Prop({ type: Number, index: true })
  updatedAt: number
}

export const ProposalEntity = SchemaFactory.createForClass(Proposal)
