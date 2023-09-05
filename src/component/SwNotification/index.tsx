import { useEffect, useState } from 'react'

export const SwNotification: React.FC = () => {
  const [waitingSw, setWaitingSw] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) return

      setWaitingSw(registration.waiting)
    })
  }, [])

  if (waitingSw === null) return <>Up to date!</>
  return (
    <>
      <button
        onClick={() => {
          waitingSw.postMessage({ type: 'SKIP_WAITING' })
          window.location.reload()
        }}
      >
        Update
      </button>
    </>
  )
}
