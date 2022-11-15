import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { ProposalService } from './proposal.service'
import { Proposal } from './entities/proposal.entity'
import { CreateProposalInput } from './dto/create-proposal.input'
import { UpdateProposalInput } from './dto/update-proposal.input'
import { InputValidator } from '@shared/validator/input.validator'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'
import { RolesService } from '@app/roles/roles.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { GetProposalsFilter } from '@app/proposal/filters/get-proposals.filter'

@Resolver(() => Proposal)
export class ProposalResolver {
  constructor(
    private readonly proposalService: ProposalService,
    private readonly rolesService: RolesService
  ) {}

  @Mutation(() => Proposal)
  //  @UseGuards(FirebaseAuthGuard)
  async createProposal(
    @Args('input', new InputValidator()) input: CreateProposalInput
  ) {
    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.role)
    })
    if (!_role) {
      throw new NotFoundError('Role not found')
    }

    const user: any = {
      _id: new Types.ObjectId('6373ab75d651155c77df3376')
    }

    return this.proposalService.create(user, _role, input)
  }

  @Query(() => [Proposal], { name: 'proposal' })
  async find(@Args('filter', new InputValidator()) filter: GetProposalsFilter) {
    console.log(filter)
    return this.proposalService.findAll()
  }

  @Query(() => Proposal, { name: 'proposal' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.proposalService.findOne(id)
  }

  @Mutation(() => Proposal)
  updateProposal(
    @Args('updateProposalInput') updateProposalInput: UpdateProposalInput
  ) {
    return this.proposalService.update(
      updateProposalInput.id,
      updateProposalInput
    )
  }

  @Mutation(() => Proposal)
  removeProposal(@Args('id', { type: () => Int }) id: number) {
    return this.proposalService.remove(id)
  }
}
