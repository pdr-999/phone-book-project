import {
  ActionIcon,
  AppShell,
  Box,
  Flex,
  Grid,
  Header,
  Text,
} from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const MyAppShell: React.FC<{ children: ReactNode }> = (props) => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AppShell
      header={
        <Header height={48} p="xs">
          <Grid>
            <Grid.Col span={2}>
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
            <Grid.Col span={8}>
              <Text align="center" lh={'1.7rem'} fw={'bold'}>
                My Phone Book
              </Text>
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
          </Grid>
          <Box></Box>
        </Header>
      }
    >
      {props.children}
    </AppShell>
  )
}
