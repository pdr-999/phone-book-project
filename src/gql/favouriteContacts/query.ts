import { gql } from '@apollo/client'

export const GET_FAVOURITE_CONTACTS = gql`
  query GetFavouriteContacts {
    favouriteContacts @client
  }
`
