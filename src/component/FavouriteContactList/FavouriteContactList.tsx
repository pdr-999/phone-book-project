import { useQuery } from '@apollo/client'
import { Box, Divider } from '@mantine/core'
import { removeContactFromFavourites } from '../../gql/favouriteContacts/data'
import { GET_FAVOURITE_CONTACTS } from '../../gql/favouriteContacts/query'
import { Contact } from '../Contact/Contact'
import { GetFavouriteContactList } from '../../gql/favouriteContacts/type'

export const FavouriteContactList: React.FC = () => {
  const { data } = useQuery<GetFavouriteContactList>(GET_FAVOURITE_CONTACTS)

  if (data?.favouriteContacts?.length === 0) return <></>
  return (
    <>
      <Box>
        <Divider labelPosition="center" label={'star'} my={'md'} />
        {/* TODO: isolate rerender to */}
        {data?.favouriteContacts.map((contact, index) => {
          const { first_name, last_name, id, phones } = contact
          return (
            <Contact
              key={id}
              firstName={first_name}
              lastName={last_name}
              onFavouriteClick={() => {
                if (!id) return
                /**
              There is currently no built-in API for persisting reactive variables, 
              but you can write variable values to localStorage (or another store) 
              whenever they're modified, and initialize those variables with their 
              stored value (if any) on app load.
             */

                removeContactFromFavourites(contact)
              }}
              phoneNumbers={
                phones?.map((phone) => ({
                  phoneNumber: phone.number,
                  id: phone.id,
                })) ?? []
              }
            />
          )
        })}
      </Box>
    </>
  )
}
