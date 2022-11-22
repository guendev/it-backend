import { Resolver } from '@nestjs/graphql'
import { FirebaseService } from './firebase.service'
import { Firebase } from './entities/firebase.entity'

@Resolver(() => Firebase)
export class FirebaseResolver {
  constructor(private readonly firebaseService: FirebaseService) {}
}
