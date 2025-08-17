import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Formulario from './Formulario/formulario'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Formulario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
