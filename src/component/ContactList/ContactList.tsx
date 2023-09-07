import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import { GetContactList, GetContactListVariables } from '../../gql/contact/type'
import { Contact, ContactProps } from '../Contact/Contact'
import { Box, Divider } from '@mantine/core'

export const ContactList: React.FC<{ contacts?: ContactProps[] }> = ({
  contacts: propsContacts = [],
}) => {
  const [contacts, setContacts] = useState(propsContacts)
  const { loading, data, variables, refetch, networkStatus } = useQuery<
    GetContactList,
    GetContactListVariables
  >(GET_CONTACT_LIST, {
    variables: {
      order_by: {
        first_name: 'asc',
      },
    },
    notifyOnNetworkStatusChange: true,
  })

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
      {data?.contact.map(({ first_name, last_name, id, phones }, index) => {
        return (
          <Box key={id}>
            {(first_name?.startsWith(
              data.contact[index - 1]?.first_name?.[0]?.toLocaleUpperCase() ??
                ''
            ) === false ||
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
              isActive={expandedContactId === id}
              phoneNumbers={
                phones?.map((phone) => ({ phoneNumber: phone.number })) ?? []
              }
            />
          </Box>
        )
      })}
    </>
  )
}
