import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const link = new HttpLink({
  uri: process.env.REACT_APP_GQL_URL,
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})
