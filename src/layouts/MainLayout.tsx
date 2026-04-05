// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom'
import { Box } from '@mantine/core'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export function MainLayout() {
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
      <Box component="main" style={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
