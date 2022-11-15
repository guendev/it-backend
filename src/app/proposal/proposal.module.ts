import { Module } from '@nestjs/common'
import { ProposalService } from './proposal.service'
import { ProposalResolver } from './proposal.resolver'
import { RolesModule } from '@app/roles/roles.module'
import { MongooseModule } from '@nestjs/mongoose'
import {
  Proposal,
  ProposalEntity
} from '@app/proposal/entities/proposal.entity'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Proposal.name,
        useFactory: () => {
          return ProposalEntity
        }
      }
    ]),
    RolesModule
  ],
  providers: [ProposalResolver, ProposalService]
})
export class ProposalModule {}
