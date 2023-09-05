import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import {
  GetContactList,
  GetContactListVariables,
  Contact as IContact,
} from '../../gql/contact/type'

export const Contact: React.FC<{ contact: IContact }> = ({ contact }) => {
  const { last_name = '', first_name = '' } = contact
  return (
    <>
      <span>
        {last_name}, {first_name}
      </span>
    </>
  )
}

export const ContactList: React.FC = () => {
  const { loading, data, fetchMore, variables } = useQuery<
    GetContactList,
    GetContactListVariables
  >(GET_CONTACT_LIST, {
    variables: {
      order_by: {
        last_name: 'asc',
      },
    },
  })

  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetchMore({
      variables: {
        offset: offset,
      },
    })
  }, [fetchMore, offset])

  if (loading) return <>Loading...</>
  return (
    <>
      <button
        onClick={() => {
          if (typeof variables?.offset === 'undefined') return
          setOffset((prev) => prev + 10)
        }}
      >
        Refetch
      </button>
      {data?.contact?.map((contact) => {
        return <Contact key={contact.id} contact={contact} />
      })}
    </>
  )
}
