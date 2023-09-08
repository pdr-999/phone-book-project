import { useQuery } from '@apollo/client'
import { Box, Divider } from '@mantine/core'
import { IconStar } from '@tabler/icons-react'
import { useState } from 'react'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import { GetContactList, GetContactListVariables } from '../../gql/contact/type'
import {
  addContactToFavourites,
  getFavouriteContactsFromLocalStorage,
  removeContactFromFavourites,
} from '../../gql/favouriteContacts/data'
import { GET_FAVOURITE_CONTACTS } from '../../gql/favouriteContacts/query'
import { GetFavouriteContactList } from '../../gql/favouriteContacts/type'
import { Contact, ContactProps } from '../Contact/Contact'

export const ContactList: React.FC<{ contacts?: ContactProps[] }> = () => {
  const { data, refetch } = useQuery<GetContactList, GetContactListVariables>(
    GET_CONTACT_LIST,
    {
      variables: {
        order_by: {
          first_name: 'asc',
        },
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const { data: favouriteContactsData } = useQuery<GetFavouriteContactList>(
    GET_FAVOURITE_CONTACTS
  )

  const favouriteContacts = getFavouriteContactsFromLocalStorage()

  const [expandedContactId, setExpandedContactId] = useState<number | null>(
    null
  )

  const contacts =
    data?.contact?.filter(
      (contact) => contact.id && !favouriteContacts.has(contact.id)
    ) ?? []

  return (
    <>
      <Box>
        {favouriteContacts.size > 0 && (
          <Divider
            labelPosition="center"
            label={<IconStar size={'1rem'} />}
            my={'md'}
          />
        )}

        {/* TODO: isolate rerender to */}
        {favouriteContactsData?.favouriteContacts.map((contact) => {
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
                setExpandedContactId(null)
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

      {/* TODO: isolate rerender to */}
      {contacts.map((contact, index) => {
        const { first_name, last_name, id, phones } = contact

        const previousFirstNameFirstLetter =
          contacts[index - 1]?.first_name?.charAt(0)?.toUpperCase() ?? ''

        return (
          <Box key={id}>
            {(first_name
              ?.toUpperCase()
              ?.startsWith(previousFirstNameFirstLetter) === false ||
              index === 0) && (
              <Divider
                sx={{
                  userSelect: 'none',
                }}
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

                addContactToFavourites(contact)
                refetch()
                setExpandedContactId(null)
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
