import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const IS_TEST_USER_KEY = 'isTestUser'
export const TestUser = () => SetMetadata(IS_TEST_USER_KEY, true)
