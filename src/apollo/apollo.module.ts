import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { UsersModule } from '@app/users/users.module'
import { UsersService } from '@app/users/users.service'

// import GraphQLJSON from 'graphql-type-json'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [UsersModule],
      inject: [UsersService],
      useFactory: (usersService: UsersService) => ({
        playground: false,
        autoSchemaFile: true,
        sortSchema: true,
        debug: true,
        cors: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: async ({ Authorization }) => {
              if (Authorization) {
                const user = await usersService.verifyToken(
                  String(Authorization).split(' ')[1]
                )
                return {
                  isSubscription: true,
                  user,
                  _token: Authorization
                }
              }
            }
          },
          'graphql-ws': {
            onConnect: async (context: any) => {
              const { connectionParams, extra } = context
              if (connectionParams.Authorization) {
                extra.user = await usersService.verifyToken(
                  String(connectionParams.Authorization).split(' ')[1]
                )
                extra._token = connectionParams.Authorization
              }
            }
          },
          context: ({ extra }) => {
            return {
              isSubscription: true,
              _token: extra._token,
              user: extra.user
            }
          }
        },
        context: ({ req }) => ({ req })
      })
    })
  ]
})
export class ApolloModule {}
