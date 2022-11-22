import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { AuthModule } from '@app/auth/auth.module'
import { AuthService } from '@app/auth/auth.service'

// import GraphQLJSON from 'graphql-type-json'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [AuthService],
      useFactory: (authService: AuthService) => ({
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
                const user = await authService.checkToken(Authorization)
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
                extra.user = await authService.checkToken(
                  connectionParams.Authorization
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
