import { Injectable, Logger } from '@nestjs/common'
import * as firebaseConfig from '../../../firebase.json'
import { app } from 'firebase-admin'
import App = app.App
import { UsersService } from '@app/users/users.service'
import * as firebase from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url
}

@Injectable()
export class FirebaseService {
  private logger: Logger = new Logger(FirebaseService.name)
  private defaultApp: App

  constructor(private usersService: UsersService) {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params)
    })
  }

  async verifyFirebaseToken(token: string) {
    let firebaseUser: DecodedIdToken
    try {
      firebaseUser = await this.defaultApp.auth().verifyIdToken(token, true)
    } catch (e) {
      this.logger.error(e)
    }
    if (firebaseUser) {
      const user = await this.usersService.findOne({ uid: firebaseUser.uid })
      if (user) {
        return user
      }
      const record = await this.defaultApp.auth().getUser(firebaseUser.uid)
      return this.usersService.create(record)
    }
  }
}
