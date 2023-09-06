import { Contact } from './Contact'
import { Box, MantineProvider } from '@mantine/core'
import { mantineTheme } from '../../mantine.config'
import { ContactList } from '.'

describe('<ContactList />', () => {
  it('renders', () => {
    cy.mount(
      <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS>
        <Box p={'md'}>
          <ContactList />
        </Box>
      </MantineProvider>
    )
  })
})
