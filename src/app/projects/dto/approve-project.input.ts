import { InputType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { Types } from 'mongoose'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { ProjectActive } from '@app/projects/enums/project.active.enum'

@InputType()
export class ApproveProjectInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsObjectID()
  id: Types.ObjectId

  @Field(() => ProjectActive)
  @IsNotEmpty()
  active: ProjectActive
}
