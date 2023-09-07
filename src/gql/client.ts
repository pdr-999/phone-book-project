import { ApolloClient, InMemoryCache } from '@apollo/client'
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist'
import { Contact } from './contact/type'
import { favouriteContactsVar } from './favouriteContacts/query'

const cache = new InMemoryCache({
  typePolicies: {
    contact: {
      fields: {
        is_favourite: {
          read(_, arg) {
            // The read function for the isInCart field
            const contact: Contact | undefined = arg.variables

            if (!contact?.id) return false

            const cachedFavouriteContactIds = JSON.parse(
              localStorage.getItem('favourite-contacts') ?? '[]'
            )

            const favouriteContacts = new Set<number>(cachedFavouriteContactIds)

            return favouriteContacts.has(contact.id)
          },
        },
      },
    },
    Query: {
      fields: {
        favouriteContacts: {
          read() {
            return favouriteContactsVar()
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
