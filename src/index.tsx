import React from 'react'
import ReactDOM from 'react-dom/client'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import { ApolloProvider } from '@apollo/client'
import { client } from './gql/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from './pages'
import { CreateContact } from './pages/contact/create'
import { createEmotionCache, MantineProvider } from '@mantine/core'
import { mantineTheme } from './mantine.config'
import { Notifications } from '@mantine/notifications'
import { ContactId } from './pages/contact/id'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/contact/create',
    element: <CreateContact />,
  },
  {
    path: '/contact/:id',
    element: <ContactId />,
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
