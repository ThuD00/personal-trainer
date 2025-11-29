import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router';
import React from 'react';
import Home from './Home.tsx';
import CustomerList from './components/CustomerList.tsx';
import TrainingSessions from './components/TrainingSessions.tsx';
import TrainingCalendar from './components/TrainingCalendar.tsx';

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
        path: "CustomerList",                // path can be defined relative to the parent path
        element: <CustomerList />,
      },
      {
        path: "TrainingSessions",
        element: <TrainingSessions />,
      },
      {
        path: "TrainingCalendar",
        element: <TrainingCalendar />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
