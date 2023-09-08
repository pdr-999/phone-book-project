import {
  ActionIcon,
  AppShell,
  Box,
  Container,
  Flex,
  Grid,
  Header,
  Text,
} from '@mantine/core'
import { IconChevronLeft, IconPlus } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const MyAppShell: React.FC<{ children: ReactNode }> = (props) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AppShell
      styles={{
        main: {
          paddingLeft: '0',
          paddingRight: '0',
        },
      }}
      header={
        <Header height={48} p="xs">
          <Container size="sm">
            <Grid>
              <Grid.Col span={3}>
                {location.pathname !== '/' && (
                  <ActionIcon
                    onClick={() => {
                      navigate(-1)
                    }}
                  >
                    <IconChevronLeft />
                  </ActionIcon>
                )}
              </Grid.Col>
              <Grid.Col span={6}>
                <Text align="center" lh={'1.7rem'} fw={'bold'}>
                  My Phone Book
                </Text>
              </Grid.Col>
              <Grid.Col span={3}>
                <Flex gap={'1rem'} justify={'flex-end'}>
                  {location.pathname !== '/contact/create' && (
                    <ActionIcon
                      onClick={() => {
                        navigate('/contact/create')
                      }}
                    >
                      <IconPlus />
                    </ActionIcon>
                  )}
                </Flex>
              </Grid.Col>
            </Grid>
            <Box></Box>
          </Container>
        </Header>
      }
    >
      {props.children}
    </AppShell>
  )
}
