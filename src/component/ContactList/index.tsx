import { useQuery } from '@apollo/client'
import { GET_CONTACT_LIST } from '../../gql/contact/query'
import { Contact as IContact, GetContactList } from '../../gql/contact/type'

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
  const res = useQuery<GetContactList>(GET_CONTACT_LIST)
  const { loading, data } = res

  if (loading) return <>Loading...</>
  return (
    <>
      <pre>{JSON.stringify(res.client.link, null, 2)}</pre>
      {data?.contact?.map((contact) => {
        return <Contact key={contact.id} contact={contact} />
      })}
    </>
  )
}
