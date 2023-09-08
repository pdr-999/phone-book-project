import React from 'react'
import { Contact } from './Contact'
import { Box, MantineProvider } from '@mantine/core'
import { mantineTheme } from '../../mantine.config'

describe('<Contact />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS>
        <Box p={'md'}>
          <Contact
            firstName="John"
            lastName="Doe"
            phoneNumbers={[
              {
                id: 1,
                phoneNumber: '+62 813 1234 5678',
              },
              {
                id: 2,
                phoneNumber: '+62 813 1234 5678',
              },
            ]}
          />
        </Box>
      </MantineProvider>
    )
  })
})
