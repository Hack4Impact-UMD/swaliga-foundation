import { Collection as ClientCollection } from "@/data/firestore/utils"

export const Collection = {
  ...ClientCollection,
  GOOGLE_OAUTH2_TOKENS: 'googleOAuth2Tokens',
  USERS: 'users',
  USERNAMES: 'usernames'
} as const;