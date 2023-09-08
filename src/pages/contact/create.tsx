import { Box } from '@mantine/core'
import { ContactAddForm } from '../../component/ContactForm/ContactAddForm'

export const CreateContact: React.FC = () => {
  // TODO: make navigation not go back and forth in PWA
  return (
    <>
      <Box>
        <ContactAddForm />
      </Box>
    </>
  )
}
