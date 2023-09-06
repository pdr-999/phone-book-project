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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/contact/create',
    element: <CreateContact />,
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
        theme={{
          colorScheme: 'dark',
          // https://omatsuri.app/color-shades-generator
          colors: {
            // Darken 18% Saturation -10%, base: #00aa5b
            green: [
              '#FFF',
              '#FFF',
              '#D8F3E6',
              '#9FE6C5',
              '#6AE0A9',
              '#38E092',
              '#16D67D',
              '#0ABF6B',
              '#00AA5B',
              '#07844A',
            ],
            // Darken 10% Saturation -10%, base: #1b2632
            dark: [
              '#AFB9C5',
              '#7B8EA3',
              '#586D84',
              '#425467',
              '#314051',
              '#253140',
              '#1B2632',
              '#141B22',
              '#0E1317',
              '#0A0D10',
            ],
          },
        }}
      >
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
