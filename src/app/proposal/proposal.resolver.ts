import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent
} from '@nestjs/graphql'
import { ProposalService } from './proposal.service'
import { Proposal } from './entities/proposal.entity'
import { CreateProposalInput } from './dto/create-proposal.input'
import { InputValidator } from '@shared/validator/input.validator'
import { RolesService } from '@app/roles/roles.service'
import { Types } from 'mongoose'
import { NotFoundError } from '@shared/errors/not-found.error'
import { GetProposalsFilter } from '@app/proposal/filters/get-proposals.filter'
import { ProjectsService } from '@app/projects/projects.service'
import { UsersService } from '@app/users/users.service'
import { CheckProposalInput } from '@app/proposal/dto/check-proposal.input'
import { UpdateProposalInput } from '@app/proposal/dto/update-proposal.input'
import { RemoveProposalInput } from '@app/proposal/dto/remove-proposal.input'
import { FirebaseAuthGuard } from '@passport/firebase-auth.guard'
import { UseGuards } from '@nestjs/common'
import { CurrentUser } from '@decorators/user.decorator'
import { ForbiddenError } from 'apollo-server-express'
import { PermissionEnum } from '@app/roles/enums/role.enum'

@Resolver(() => Proposal)
export class ProposalResolver {
  constructor(
    private readonly proposalService: ProposalService,
    private readonly rolesService: RolesService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => Proposal)
  @UseGuards(FirebaseAuthGuard)
  async createProposal(
    @Args('input', new InputValidator()) input: CreateProposalInput,
    @CurrentUser() user
  ) {
    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.role)
    })
    if (!_role) {
      throw new NotFoundError('Role not found')
    }
    // check dự án
    const _project = await this.projectsService.findOne({
      _id: _role.project
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }
    // check user đã có vai trờ hay chưa
    const role = await this.rolesService.findOne({
      user: user._id,
      project: _project._id
    })
    if (role) {
      throw new ForbiddenError('You already has role')
    }
    // check user đã gửi đề nghị hay chưa
    const _proposal = await this.proposalService.findOne({
      user: user._id,
      project: _project._id
    })
    if (_proposal) {
      throw new ForbiddenError('You already has proposal')
    }

    const _doc: Partial<Omit<Proposal, 'role' | 'user' | 'id'>> = Object.assign(
      {},
      input,
      {
        role: _role._id,
        user: user._id,
        project: _role.project
      }
    )
    return this.proposalService.create(_doc)
  }

  @Query(() => [Proposal], { name: 'proposals' })
  async find(@Args('filter', new InputValidator()) filter: GetProposalsFilter) {
    const _project = await this.projectsService.findOne({
      _id: new Types.ObjectId(filter.project)
    })
    if (!_project) {
      throw new NotFoundError('Project not found')
    }
    // Todo: check permissions
    return this.proposalService.find(_project)
  }

  @Mutation(() => Proposal)
  @UseGuards(FirebaseAuthGuard)
  async checkProposal(
    @Args('input', new InputValidator()) input: CheckProposalInput,
    @CurrentUser() user
  ) {
    const _proposal = await this.proposalService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_proposal) {
      throw new NotFoundError('Proposal not found')
    }
    // Todo: check permissions
    const project = await this.projectsService.findOne({
      _id: _proposal.project
    })
    if (!project) {
      throw new NotFoundError('Project not found')
    }

    // KO dc phép duyệt owner
    if (project.owner.toString() !== user._id.toString()) {
      throw new ForbiddenError('You are not allowed to do this')
    }

    const _role = await this.rolesService.findOne({
      project: project._id,
      user: user._id
    })
    // KO có quyền
    if (!_role) {
      throw new ForbiddenError('You are not allowed to do this')
    }
    // KO đủ quyền
    if (_role.permissions.includes(PermissionEnum.UPDATE_ROLE)) {
      throw new ForbiddenError('You are not allowed to do this')
    }
    const existRole = await this.rolesService.findOne({
      project: project._id,
      user: _proposal.user
    })
    if (existRole) {
      throw new ForbiddenError('User already has role')
    }

    // Người kiểm duyệt chỉ dc phép duyệt hoặc từ chối
    return this.proposalService.update(_proposal, {
      note: input.note,
      status: input.status
    })
  }

  @Query(() => Proposal, { name: 'proposal' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    // return this.proposalService.findOne(id)
  }

  @Mutation(() => Proposal)
  async updateProposal(@Args('input') input: UpdateProposalInput) {
    const _proposal = await this.proposalService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_proposal) {
      throw new NotFoundError('Proposal not found')
    }

    const _role = await this.rolesService.findOne({
      _id: new Types.ObjectId(input.role)
    })
    if (!_role) {
      throw new NotFoundError('Role not found')
    }

    return this.proposalService.update(_proposal, {
      resume: input.resume,
      letter: input.letter,
      role: _role._id,
      project: _role.project
    })
  }

  @Mutation(() => Proposal)
  async removeProposal(
    @Args('input', new InputValidator()) input: RemoveProposalInput
  ) {
    const _proposal = await this.proposalService.findOne({
      _id: new Types.ObjectId(input.id)
    })
    if (!_proposal) {
      throw new NotFoundError('Proposal not found')
    }
    return this.proposalService.remove({ _id: _proposal._id })
  }

  @ResolveField()
  async user(@Parent() author: Proposal) {
    return this.usersService.findOne({ _id: author.user })
  }

  @ResolveField()
  async project(@Parent() author: Proposal) {
    return this.projectsService.findOne({ _id: author.project })
  }

  @ResolveField()
  async role(@Parent() author: Proposal) {
    return this.rolesService.findOne({ _id: author.role })
  }
}
