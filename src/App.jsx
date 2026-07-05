import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Help from './pages/Help.jsx'
import LetsSee from './pages/LetsSee.jsx'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lets-see" element={<LetsSee />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
