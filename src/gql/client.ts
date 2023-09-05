import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const reactAppGqlUrl = () => {
  return process.env.REACT_APP_GQL_URL?.replace(/"/g, '')
}

const link = new HttpLink({
  uri: reactAppGqlUrl(),
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})
