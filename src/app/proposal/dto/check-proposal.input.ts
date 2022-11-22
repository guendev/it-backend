import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { Types } from 'mongoose'
import { ProposalStatus } from '@app/proposal/enums/proposal.enum'

@InputType()
export class CheckProposalInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId

  // status
  @Field(() => ProposalStatus)
  @IsNotEmpty()
  status: ProposalStatus

  // Note
  @Field(() => String, { nullable: true, defaultValue: '' })
  note: string
}
