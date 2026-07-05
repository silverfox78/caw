import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Help from './pages/Help.jsx'
import LetsSee from './pages/LetsSee.jsx'
import { MobileActionsProvider } from './context/MobileActionsContext.jsx'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <MobileActionsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lets-see" element={<LetsSee />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </MobileActionsProvider>
    </BrowserRouter>
  )
}

export default App
