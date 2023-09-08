import { useQuery } from '@apollo/client'
import { GET_CONTACT_BY_PK } from '../../gql/contact/query'
import { GetContactByPk, GetContactByPkVariables } from '../../gql/contact/type'
import { useParams } from 'react-router-dom'
import { ContactForm } from '../../component/ContactForm/ContactForm'
import { Box, Loader } from '@mantine/core'

export const ContactId: React.FC = () => {
  const { id } = useParams()

  const { data, refetch, loading } = useQuery<
    GetContactByPk,
    GetContactByPkVariables
  >(GET_CONTACT_BY_PK, {
    variables: {
      id: parseInt(id!),
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  })

  return (
    <>
      <Box p={'md'}>
        {loading && <Loader />}
        {data && (
          <ContactForm
            initialValues={{
              id: data.contact_by_pk.id,
              firstName: data.contact_by_pk.first_name ?? '',
              lastName: data.contact_by_pk.last_name ?? '',
              phones:
                data.contact_by_pk.phones?.map((phone) => ({
                  id: phone?.id,
                  phoneNumber: phone?.number,
                })) ?? [],
            }}
          />
        )}
      </Box>
    </>
  )
}
