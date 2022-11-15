import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Field, Float, ID, ObjectType } from '@nestjs/graphql'
import { User, UserDocument } from '@app/users/entities/user.entity'
import { Role, RoleDocument } from '@app/roles/entities/role.entity'
import { ProposalEnum } from '@app/proposal/enums/proposal.enum'

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
  @Field(() => Role)
  role: RoleDocument | Types.ObjectId

  // Dự án đang chạy hay là chuẩn bị
  @Prop({
    index: true,
    default: ProposalEnum.WAITING,
    type: Number,
    enum: ProposalEnum
  })
  @Field(() => ProposalEnum, { defaultValue: ProposalEnum.WAITING })
  status: ProposalEnum

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
