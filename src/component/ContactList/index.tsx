import { useQuery } from '@apollo/client'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import { GetContactList } from '../../gql/contact/type'

export const ContactList: React.FC = () => {
  const { loading, data } = useQuery<GetContactList>(GET_CONTACT_LIST)

  if (loading) return <>Loading...</>
  return (
    <>
      {data?.contact?.map((contact) => {
        return <div key={contact.id}>{contact.first_name}</div>
      })}
    </>
  )
}
