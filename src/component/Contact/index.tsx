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
  const { loading, data, variables, refetch, networkStatus } = useQuery<
    GetContactList,
    GetContactListVariables
  >(GET_CONTACT_LIST, {
    variables: {
      order_by: {
        last_name: 'asc',
      },
    },
    fetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
  })

  const [offset, setOffset] = useState(0)

  // TODO: offsetMore with cache, it's currently not fetching from cache
  // const [offsetMore, setOffsetMore] = useState(0)
  // useEffect(() => {
  //   fetchMore({
  //     variables: {
  //       offset: offsetMore,
  //     },
  //   })
  // }, [fetchMore, offsetMore])

  useEffect(() => {
    refetch({
      offset: offset,
    })
  }, [offset, refetch])

  return (
    <>
      {loading ? <>Loading...</> : <>Ready</>}
      {networkStatus}
      <button
        onClick={() => {
          if (typeof variables?.offset === 'undefined') return
          // setOffsetMore((prev) => prev + 10)
        }}
      >
        Fetch More
      </button>

      <button onClick={() => setOffset((prev) => (prev === 0 ? 0 : prev - 10))}>
        prev
      </button>
      <button onClick={() => setOffset((prev) => prev + 10)}>Next</button>
      {data?.contact?.map((contact) => {
        return <Contact key={contact.id} contact={contact} />
      })}
    </>
  )
}
