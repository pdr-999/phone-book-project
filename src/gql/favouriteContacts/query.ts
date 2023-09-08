import { gql, makeVar } from '@apollo/client'
import { getFavouriteContactsFromLocalStorage } from './data'
import { Contact } from '../contact/type'

export const GET_FAVOURITE_CONTACTS = gql`
  query GetFavouriteContacts {
    favouriteContacts @client
  }
`

export const favouriteContactsVar = makeVar<Contact[]>([
  ...getFavouriteContactsFromLocalStorage().values(),
])
