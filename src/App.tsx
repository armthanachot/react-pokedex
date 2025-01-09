import { useEffect, useState } from 'react'
import { HttpBase } from './api/axios'
import './App.css'
import Pokemon from './pages/Pokemon'

function App() {
  const [httpInstance, setHttpInstance] = useState<HttpBase | null>(null)

  useEffect(() => {
    setHttpInstance(new HttpBase())
  }, [])

  return (
    <>
      {httpInstance && <Pokemon httpBase={httpInstance} />}
    </>
  )
}

export default App
