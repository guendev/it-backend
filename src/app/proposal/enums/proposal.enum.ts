import { registerEnumType } from '@nestjs/graphql'

export enum ProposalEnum {
  // Chờ phê duyệt
  WAITING,
  APPROVED,
  REJECTED
}

registerEnumType(ProposalEnum, {
  name: 'ProposalEnum'
})
