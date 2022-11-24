import { InputType } from '@nestjs/graphql'
import { FilterOffet } from '@shared/args/filter-offset.input'

@InputType()
export class GetPostsFilter extends FilterOffet {}
