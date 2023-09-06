import { Box, MantineProvider } from '@mantine/core'
import { mantineTheme } from '../../mantine.config'
import { ContactList } from './ContactList'
import { ContactProps } from '../Contact/Contact'
const contacts: ContactProps[] = [
  {
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumbers: [
      {
        id: 1,
        phoneNumber: '+62 812 1234 5467',
      },
    ],
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumbers: [
      {
        id: 1,
        phoneNumber: '+62 812 1234 5467',
      },
    ],
  },
]
describe('<Contact />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS>
        <Box p={'md'}>
          <ContactList contacts={contacts} />
        </Box>
      </MantineProvider>
    )
  })
})
