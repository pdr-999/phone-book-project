import { useEffect } from 'react'
import { ContactList } from '../component/ContactList/ContactList'
import { client } from '../gql/client'
import { EDIT_PHONE_BY_PK } from '../gql/phone/mutation'
import { EditPhoneByPkVariables } from '../gql/phone/type'
import { Container } from '@mantine/core'

const Index: React.FC = () => {
  useEffect(() => {
    client.writeQuery<any, EditPhoneByPkVariables>({
      query: EDIT_PHONE_BY_PK,
      data: {
        // Contains the data to write
        todo: {
          __typename: 'contact',
          created_at: '2023-09-08T14:07:23.661989+00:00',
          first_name: 'jon23',
          id: 6030,
          last_name: 'uuih',
          updated_at: null,
        },
      },
      variables: {
        set: {
          number: '1',
        },
        where: {
          id: {
            _eq: 6030,
          },
        },
      },
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <Container size="sm">
          <ContactList />
        </Container>
      </header>
    </div>
  )
}

export default Index
