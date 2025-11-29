import './App.css'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { NavLink, Outlet } from 'react-router'
import { useState } from 'react'
import type { Customer } from './types'
import Reset from './reset'

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  return (
    <>
    <CssBaseline/>

    <AppBar position='static'>
        <Toolbar>
          <Typography>Personal Trainer</Typography>
        </Toolbar>
      </AppBar>

    <Container maxWidth="lg" sx={{ textAlign: "center" }}>
      
    <Box
        sx={{
          padding: "1rem 2rem",
          display: "flex",
          gap: 3,
          mb: 3,
          justifyContent: "center",
          //fontSize: "1.25rem", 
          //fontWeight: "bold",
        }}
      >
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/CustomerList"}>Customer List</NavLink>
        <NavLink to={"/TrainingSessions"}>Training Sessions</NavLink>
        <NavLink to={"/TrainingCalendar"}>Calendar</NavLink>
      </Box>

      <Outlet context={{ customers, setCustomers }} />

      <Reset />
      
    </Container>
    </>
  )
}

export default App
