import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LetsSee from './pages/LetsSee.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lets-see" element={<LetsSee />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
