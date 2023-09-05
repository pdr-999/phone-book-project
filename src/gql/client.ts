import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GQL_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          contact: {
            keyArgs: [],
            merge(existing = [], incoming = []) {
              return [...existing, ...incoming]
            },
          },
        },
      },
    },
  }),
})
