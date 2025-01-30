import { useEffect, useState } from 'react'
import { HttpBase } from './api/axios'
import './App.css'
import Pokemon from './pages/Pokemon'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonDetail from './pages/PokemonDetail';
import Pokemon2 from './pages/Pokemon2';
import { PokemonProvider } from './pages/context/PokemonContext';


const queryClient = new QueryClient();

function App() {
  const [httpInstance, setHttpInstance] = useState<HttpBase | null>(null)

  useEffect(() => {
    setHttpInstance(new HttpBase())
  }, [])

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        {/* {httpInstance && <Pokemon httpBase={httpInstance} />} */}
        <Routes>
          {/* <Route path="/" element={<Pokemon httpBase={httpInstance!} />} /> */}
          <Route path="/" element={
            <PokemonProvider>
              <Pokemon2 />
            </PokemonProvider>

          } />
          <Route path="/detail" element={<PokemonDetail />} />
        </Routes>
      </QueryClientProvider>
    </Router>
  )
}

export default App
