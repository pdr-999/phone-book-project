import { useQuery } from '@apollo/client'
import { GET_FAVOURITE_CONTACTS } from '../../gql/favouriteContacts/query'

export const FavouriteContactList: React.FC = () => {
  const { data } = useQuery(GET_FAVOURITE_CONTACTS, {
    notifyOnNetworkStatusChange: true,
  })

  return <>{JSON.stringify(data)}</>
}
