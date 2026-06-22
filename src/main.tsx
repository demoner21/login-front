import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/auth-context.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no index.html')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)