import { registerEnumType } from '@nestjs/graphql'

export enum ProposalStatus {
  // Chờ phê duyệt
  WAITING,
  APPROVED,
  REJECTED
}

registerEnumType(ProposalStatus, {
  name: 'ProposalStatus'
})
