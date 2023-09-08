import { ApolloClient, InMemoryCache } from '@apollo/client'
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist'
import { favouriteContactsVar } from './favouriteContacts/data'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        favouriteContacts: {
          read() {
            return favouriteContactsVar()
          },
        },
        contact: {
          read(existing, b) {
            return existing
          },
          merge(existing, incoming: { __ref: string }[], { args: _args }) {
            const ext = new Set<string>(
              existing?.map((e: { __ref: string }) => e.__ref) ?? []
            )
            for (const inc of incoming) {
              ext.add(inc.__ref)
            }

            return [...ext.values()].map((e) => ({ __ref: e }))
          },
        },
      },
    },
  },
})
// await before instantiating ApolloClient, else queries might run before the cache is persisted
await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GQL_URL,
  cache,
})
