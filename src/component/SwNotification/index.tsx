import { Box, Button, Flex, Text } from '@mantine/core'
import { useEffect, useState } from 'react'

export const SwNotification: React.FC = () => {
  const [waitingSw, setWaitingSw] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator)
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration) return

        setWaitingSw(registration.waiting)
      })
  }, [])

  if (waitingSw === null) return <></>
  return (
    <Flex align={'center'} justify={'center'} gap={'sm'}>
      <Text align="center" size={'sm'}>
        New Version Is Available
      </Text>
      <Button
        compact
        onClick={() => {
          waitingSw.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }}
      >
        Reload
      </Button>
    </Flex>
  )
}
