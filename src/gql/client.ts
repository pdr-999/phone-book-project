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
      },
    },
    // contact: {
    //   fields: {
    //     contact: {
    //       keyArgs: ['id'],
    //       merge(existing, incoming: { __ref: string }[], { args: _args }) {
    //         const ext = new Set<string>(
    //           existing?.map((e: { __ref: string }) => e.__ref) ?? []
    //         )

    //         for (const inc of incoming) {
    //           ext.add(inc.__ref)
    //         }
    //         return [...ext.values()].map((e) => ({ __ref: e }))
    //       },
    //     },
    //   },
    // },
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
  // cache: new InMemoryCache({
  // typePolicies: {
  //   Query: {
  //     fields: {
  //       contact: {
  //         keyArgs: [],
  //         // merge(existing = [], incoming = []) {
  //         //   return [...existing, ...incoming]
  //         // },
  //         merge(
  //           existing?: { __ref: string }[],
  //           incoming?: { __ref: string }[]
  //         ) {
  //           const idSet = new Set(existing?.map((ext) => ext.__ref) ?? [])
  //           incoming?.forEach((inc) => {
  //             idSet.add(inc.__ref)
  //           })
  //           return Array.from(idSet.values()).map((uniq) => ({ __ref: uniq }))
  //         },
  //       },
  //     },
  //   },
  // },
  // }),
})
