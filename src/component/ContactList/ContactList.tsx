import { useQuery } from '@apollo/client'
import { Box, Divider } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconStar, IconStarFilled } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { useWindowScroll } from '@mantine/hooks'
const scrollMaxValue = () => {
  const body = document.body
  const html = document.documentElement

  const documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  const windowHeight = window.innerHeight

  return documentHeight - windowHeight
}
const PER_PAGE = 5
export const ContactList: React.FC<{ contacts?: ContactProps[] }> = () => {
  const [scroll] = useWindowScroll()

  const maxScrollH = scrollMaxValue()

  const navigate = useNavigate()

  const { data, fetchMore } = useQuery<GetContactList, GetContactListVariables>(
    GET_CONTACT_LIST,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        limit: PER_PAGE,
        offset: 0,
        order_by: {
          first_name: 'asc',
        },
      },
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOffset] = useState(0)

  /**
   * FIXME:
   * Backend doesn't have pagination
   */
  const [isEndOfData, setIsEndOfData] = useState(false)

  useEffect(() => {
    if (isEndOfData) return
    // FIXME: if footer is really long then you gotta scroll till bottom
    if (scroll.y === maxScrollH) {
      setOffset((prev) => {
        const newPrev = prev + PER_PAGE

        fetchMore({
          variables: {
            offset: newPrev,
          },
        })
          .then((res) => {
            if (res?.data.contact.length === 0) {
              setIsEndOfData(true)
            }
          })
          .catch(() => {})

        return newPrev
      })
    }
  }, [scroll.y, maxScrollH, fetchMore, isEndOfData])

  return (
    <>
      <Box>
        {favouriteContacts.size > 0 && (
          <Divider
            labelPosition="center"
            label={<IconStarFilled size={'1rem'} />}
            my={'md'}
          />
        )}

        {/* TODO: isolate rerender to */}
        {favouriteContactsData?.favouriteContacts.map((contact) => {
          const { first_name, last_name, id, phones } = contact
          return (
            <Contact
              isActive={expandedContactId === id}
              key={id}
              isFavourite={true}
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

                removeContactFromFavourites(contact)
                setExpandedContactId(null)
                notifications.show({
                  message: 'Removed to favourites',
                  icon: <IconStar />,
                  styles: (theme) => ({
                    icon: {
                      backgroundColor: 'transparent',
                      color: theme.colors.yellow[2],
                    },
                    root: {
                      backgroundColor: theme.colors.dark[5],
                    },
                  }),
                  autoClose: 2000,
                })
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
                notifications.show({
                  message: 'Added to favourites',
                  icon: <IconStarFilled />,
                  styles: (theme) => ({
                    icon: {
                      backgroundColor: 'transparent',
                      color: theme.colors.yellow[2],
                    },
                    root: {
                      backgroundColor: theme.colors.dark[5],
                    },
                  }),
                  autoClose: 2000,
                })
                setExpandedContactId(null)
              }}
              onEditClick={() => {
                navigate(`/contact/${id}`)
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
