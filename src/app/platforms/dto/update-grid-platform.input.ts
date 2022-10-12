import { InputType, Field, ID } from '@nestjs/graphql'
import { IsObjectID } from '@shared/validator/objectid.validator'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class UpdateGridPlatformInput {
  @Field(() => [UpdateGridPlatformInputItem])
  @IsNotEmpty()
  map: UpdateGridPlatformInputItem[]
}

@InputType()
export class UpdateGridPlatformInputItem {
  @Field()
  @IsObjectID()
  id: string

  @Field(() => [ID])
  @IsObjectID({ each: true })
  children: string[]
}
