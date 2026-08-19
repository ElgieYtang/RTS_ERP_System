import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/context/AuthContext'
import { DemoProvider } from '@/context/DemoContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DemoProvider>
        <App />
      </DemoProvider>
    </AuthProvider>
  </StrictMode>,
)
