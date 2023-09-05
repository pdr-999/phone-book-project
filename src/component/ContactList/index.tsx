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
  const { loading, data } = useQuery<GetContactList>(GET_CONTACT_LIST)

  if (loading) return <>Loading...</>
  return (
    <>
      {data?.contact?.map((contact) => {
        return <Contact key={contact.id} contact={contact} />
      })}
    </>
  )
}
