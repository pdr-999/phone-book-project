import { useQuery } from '@apollo/client'
import { Box, Divider } from '@mantine/core'
import { useState } from 'react'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import { GetContactList, GetContactListVariables } from '../../gql/contact/type'
import { addContactToFavourites } from '../../gql/favouriteContacts/data'
import { Contact, ContactProps } from '../Contact/Contact'

export const ContactList: React.FC<{ contacts?: ContactProps[] }> = () => {
  const { data } = useQuery<GetContactList, GetContactListVariables>(
    GET_CONTACT_LIST,
    {
      variables: {
        order_by: {
          first_name: 'asc',
        },
      },
      context: {
        is_favourite: true,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  // TODO: offsetMore with cache, it's currently not fetching from cache
  // const [offsetMore, setOffsetMore] = useState(0)
  // useEffect(() => {
  //   fetchMore({
  //     variables: {
  //       offset: offsetMore,
  //     },
  //   })
  // }, [fetchMore, offsetMore])

  // useEffect(() => {
  //   refetch({
  //     offset: offset,
  //   })
  // }, [offset, refetch])

  const [expandedContactId, setExpandedContactId] = useState<number | null>(
    null
  )
  return (
    <>
      {/* TODO: isolate rerender to */}
      {data?.contact.map((contact, index) => {
        const { first_name, last_name, id, phones } = contact
        const previousFirstNameFirstLetter =
          data.contact[index - 1]?.first_name?.charAt(0)?.toUpperCase() ?? ''

        return (
          <Box key={id}>
            {(first_name
              ?.toUpperCase()
              ?.startsWith(previousFirstNameFirstLetter) === false ||
              index === 0) && (
              <Divider
                labelPosition="center"
                label={first_name?.charAt(0).toUpperCase()}
                my={'md'}
              />
            )}

            <Contact
              firstName={first_name}
              lastName={last_name}
              onClick={() => {
                if (!id) return
                const newId = id === expandedContactId ? null : id

                setExpandedContactId(newId)
              }}
              onFavouriteClick={() => {
                if (!id) return
                /**
                  There is currently no built-in API for persisting reactive variables, 
                  but you can write variable values to localStorage (or another store) 
                  whenever they're modified, and initialize those variables with their 
                  stored value (if any) on app load.
                 */

                addContactToFavourites(id)
              }}
              isActive={expandedContactId === id}
              phoneNumbers={
                phones?.map((phone) => ({
                  phoneNumber: phone.number,
                  id: phone.id,
                })) ?? []
              }
            />
          </Box>
        )
      })}
    </>
  )
}
