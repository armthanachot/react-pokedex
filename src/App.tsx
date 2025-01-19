import { useEffect, useState } from 'react'
import { HttpBase } from './api/axios'
import './App.css'
import Pokemon from './pages/Pokemon'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [httpInstance, setHttpInstance] = useState<HttpBase | null>(null)

  useEffect(() => {
    setHttpInstance(new HttpBase())
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {httpInstance && <Pokemon httpBase={httpInstance} />}
      </QueryClientProvider>
    </>
  )
}

export default App
