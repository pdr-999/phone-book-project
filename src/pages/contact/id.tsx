import { useQuery } from '@apollo/client'
import { Box, Container, Loader } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { ContactForm } from '../../component/ContactForm/ContactForm'
import { GET_CONTACT_BY_PK } from '../../gql/contact/query'
import { GetContactByPk, GetContactByPkVariables } from '../../gql/contact/type'

export const ContactId: React.FC = () => {
  const { id } = useParams()

  const { data, loading } = useQuery<GetContactByPk, GetContactByPkVariables>(
    GET_CONTACT_BY_PK,
    {
      variables: {
        id: parseInt(id!),
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    }
  )

  return (
    <>
      <Container size="sm">
        <Box>
          {loading && <Loader />}
          {data?.contact_by_pk?.id ? (
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
          ) : (
            // TODO: better error message
            'No contact found'
          )}
        </Box>
      </Container>
    </>
  )
}
