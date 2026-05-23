import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Timer from './pages/Timer'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/timer" element={<Timer />} />
    </Routes>
  )
}
