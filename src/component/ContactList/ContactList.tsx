import { useMutation, useQuery } from '@apollo/client'
import { Box, Divider, TextInput } from '@mantine/core'
import { useDebouncedValue, useWindowScroll } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconStar, IconStarFilled } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DELETE_CONTACT_BY_ID } from '../../gql/contact/mutation'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import {
  Contact as ContactType,
  GetContactList,
  GetContactListVariables,
} from '../../gql/contact/type'
import {
  addContactToFavourites,
  getFavouriteContactsFromLocalStorage,
  removeContactFromFavourites,
} from '../../gql/favouriteContacts/data'
import { GET_FAVOURITE_CONTACTS } from '../../gql/favouriteContacts/query'
import { GetFavouriteContactList } from '../../gql/favouriteContacts/type'
import { Contact, ContactProps } from '../Contact/Contact'
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

const DebouncedTextInput: React.FC<{ onChange: (value: string) => unknown }> = (
  props
) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 200)

  useEffect(() => {
    props.onChange(debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])
  return (
    <>
      <TextInput
        placeholder="Search..."
        onChange={(e) => {
          const text = e.target.value
          setSearch(text)
        }}
      />
    </>
  )
}
const searchFilter = (contact: ContactType, searchQuery: string) => {
  const fullName = `${contact.first_name} ${contact.last_name}`

  return (
    fullName.toLocaleLowerCase()?.includes(searchQuery?.toLocaleLowerCase()) ||
    !!contact.phones?.find((phone) =>
      phone.number
        ?.toLocaleLowerCase()
        ?.includes(searchQuery?.toLocaleLowerCase())
    )
  )
}
const PER_PAGE = 10
export const ContactList: React.FC<{ contacts?: ContactProps[] }> = () => {
  const [scroll] = useWindowScroll()

  const maxScrollH = scrollMaxValue()

  const navigate = useNavigate()

  /**
   * FIXME: after creating Zone Doe, then changing it to Aone Done, user stays at bottom
   */
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOffset] = useState(0)

  /**
   * FIXME:
   * Backend doesn't have pagination
   */
  const [isEndOfData, setIsEndOfData] = useState(false)

  useEffect(() => {
    // FIXME: if footer is really long then you gotta scroll till bottom
    if (!isEndOfData && scroll.y === maxScrollH) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll.y, maxScrollH, isEndOfData])

  const [mutateDeleteContact] = useMutation<
    unknown,
    {
      deleteContactByPkId: number
    }
  >(DELETE_CONTACT_BY_ID)

  const [debouncedSearch, setDebouncedSearch] = useState('')

  const contacts =
    data?.contact?.filter(
      (contact) =>
        contact.id &&
        !favouriteContacts.has(contact.id) &&
        searchFilter(contact, debouncedSearch)
    ) ?? []

  useEffect(() => {
    // if (debouncedSearch.length === 0) {
    // setIsEndOfData(false)
    // setOffset(0)
    // refetch({
    //   where: undefined,
    // })
    // } else {
    //   refetch({
    //     where: {
    //       _or: [
    //         {
    //           first_name: {
    //             _ilike: `%${debouncedSearch}%`,
    //           },
    //         },
    //         {
    //           last_name: {
    //             _ilike: `%${debouncedSearch}%`,
    //           },
    //         },
    //         {
    //           phones: {
    //             number: {
    //               _ilike: `%${debouncedSearch}%`,
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const onDelete = (id: number) => {
    if (!id) return
    mutateDeleteContact({
      variables: {
        deleteContactByPkId: id,
      },
      update(cache) {
        const normalizedId = cache.identify({
          id,
          __typename: 'contact',
        })
        cache.evict({ id: normalizedId })
        cache.gc()
      },
    })
      .then(() => {
        notifications.show({
          message: 'Deleted contact',
        })
        // TODO: Handle error
      })
      .catch(() => {})
  }
  return (
    <>
      <DebouncedTextInput
        onChange={(value) => {
          setDebouncedSearch(value)
        }}
      />
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
              onConfirmDelete={() => {
                console.log(id)
                if (!id) return
                onDelete(id)
                removeContactFromFavourites(contact)
              }}
              onEditClick={() => {
                navigate(`/contact/${id}`)
              }}
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
              onConfirmDelete={() => {
                if (!id) return
                onDelete(id)
              }}
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
