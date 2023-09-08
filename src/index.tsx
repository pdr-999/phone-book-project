import { ApolloProvider } from '@apollo/client'
import { createEmotionCache, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MyAppShell } from './component/AppShell/AppShell'
import { client } from './gql/client'
import { mantineTheme } from './mantine.config'
import Index from './pages'
import { CreateContact } from './pages/contact/create'
import { ContactId } from './pages/contact/id'
import reportWebVitals from './reportWebVitals'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const ElementWrapper = (component: ReactNode) => {
  return <MyAppShell>{component}</MyAppShell>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: ElementWrapper(<Index />),
  },
  {
    path: '/contact/create',
    element: ElementWrapper(<CreateContact />),
  },
  {
    path: '/contact/:id',
    element: ElementWrapper(<ContactId />),
  },
])

const myCache = createEmotionCache({ key: 'mantine', prepend: true })

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider
        emotionCache={myCache}
        withGlobalStyles
        withNormalizeCSS
        theme={mantineTheme}
      >
        <Notifications />

        <RouterProvider router={router} />
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
