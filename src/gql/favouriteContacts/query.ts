import { gql, makeVar } from '@apollo/client'
import { getFavouriteContactsFromLocalStorage } from './data'

export const GET_FAVOURITE_CONTACTS = gql`
  query GetFavouriteContacts {
    favouriteContacts @client
  }
`

export const favouriteContactsVar = makeVar<number[]>([
  ...getFavouriteContactsFromLocalStorage().values(),
])
