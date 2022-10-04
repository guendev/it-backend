import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@app/users/entities/user.entity'
import { FilterQuery, Model } from 'mongoose'
import * as firebaseConfig from '../../../firebase.json'
import { app, auth } from 'firebase-admin'
import App = app.App
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
export class UsersService {
  private logger: Logger = new Logger('UsersService')
  private defaultApp: App

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params)
    })
  }

  async create(user: auth.UserRecord) {
    this.logger.log(`Creating a new user: ${user.displayName}`)
    return this.userModel.create({
      name: user.displayName || 'Anonymous',
      uid: user.uid,
      createdAt: Date.now()
    })
  }

  async findOne(filter: FilterQuery<UserDocument>) {
    // Todo: upsert user
    return this.userModel.findOne(filter)
  }

  async verifyToken(token: string) {
    let firebaseUser: DecodedIdToken
    try {
      firebaseUser = await this.defaultApp.auth().verifyIdToken(token, true)
    } catch (e) {
      this.logger.error(e)
    }
    if (firebaseUser) {
      const user = await this.findOne({ uid: firebaseUser.uid })
      if (user) {
        return user
      }
      const record = await this.defaultApp.auth().getUser(firebaseUser.uid)
      return this.create(record)
    }
  }
}
