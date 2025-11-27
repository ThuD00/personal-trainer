import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Customerlist from './components/CustomerList.tsx';
import Trainingsessions from './components/TrainingSessions.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import React from 'react';
import Home from './Home.tsx';

const router = createBrowserRouter([  // Import components that are used in routes
  {
    path: "/",
    element: <App />,
    children: [                       // children are nested routes with a route
      {
        element: <Home />,
        index: true                   // index route does not need any path
      },
      {
        path: "Customerlist",                // path can be defined relative to the parent path
        element: <Customerlist />,
        index: true                   // index route does not need any path
      },
      {
        path: "Trainingsessions",
        element: <Trainingsessions />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
