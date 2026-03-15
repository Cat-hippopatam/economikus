// src/layouts/AuthLayout.tsx
import { Outlet } from 'react-router-dom'
import { Box } from '@mantine/core'
import { Header } from '../components/layout/Header'

export function AuthLayout() {
  return (
    <Box 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: '#F8F6F3'
      }}
    >
      <Header />
      <Box component="main" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Outlet />
      </Box>
    </Box>
  )
}
