import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import { LandingPage } from './pages/LandingPage'
import { HowItWasMade } from './pages/HowItWasMade'
import { SlideViewer } from './components/SlideViewer'
import { disneyDeck } from './data/disney-deck'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/view"
          element={
            <SlideViewer
              initialSlides={disneyDeck}
              title="Disney AI Enablement"
              mode="edit"
            />
          }
        />
        <Route
          path="/view/review"
          element={
            <SlideViewer
              initialSlides={disneyDeck}
              title="Disney AI Enablement"
              mode="review"
            />
          }
        />
        <Route
          path="/view/present"
          element={
            <SlideViewer
              initialSlides={disneyDeck}
              title="Disney AI Enablement"
              mode="present"
            />
          }
        />
        <Route path="/how" element={<HowItWasMade />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
