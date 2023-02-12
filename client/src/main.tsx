import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { MantineProvider } from '@mantine/core';
import { trpc } from './trpc'
import './index.css'
import Index from './routes'
import Error from './routes/error'
import Home from './routes/home'
import { NotificationsProvider } from '@mantine/notifications'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <Error />,
    children: [
      {
        path: "/home",
        element: <Home />
      }
    ]
  },
]);

const Root = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:5000/trpc',
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            } as RequestInit);
          },
        }),
      ],
    }),
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NotificationsProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider {...{ router: router }}>
              <App />
            </RouterProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </NotificationsProvider>
    </MantineProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
