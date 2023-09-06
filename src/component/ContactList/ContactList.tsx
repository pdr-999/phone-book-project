import { useState } from 'react'
import { Contact, ContactProps } from '../Contact/Contact'
import { GetContactList, GetContactListVariables } from '../../gql/contact/type'
import { useQuery } from '@apollo/client'
import { GET_CONTACT_LIST } from '../../gql/contact/query'

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

  return (
    <>
      {data?.contact.map(({ first_name, last_name, id, phones }, index) => (
        <Contact
          key={id}
          firstName={first_name}
          lastName={last_name}
          phoneNumbers={
            phones?.map((phone) => ({ phoneNumber: phone.number })) ?? []
          }
        />
      ))}
    </>
  )
}
