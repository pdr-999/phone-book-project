import { Avatar, Box } from '@mantine/core'

interface ContactProps {
  avatarUrl?: string
}
export const Contact: React.FC<ContactProps> = (props) => {
  const { avatarUrl = 'https://ui-avatars.com/api/?name=+62' } = props
  return (
    <>
      <Box>
        <Avatar src={avatarUrl} alt="it's me" />
      </Box>
    </>
  )
}
