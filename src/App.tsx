import { useState } from 'react'
import './styles/globals.css'
import { Presenter } from './components/Presenter'
import { IntakeForm } from './components/IntakeForm'
import { BriefView } from './components/BriefView'
import { disneyDeck } from './data/disney-deck'
import type { AppView, IntakeData, CompanyBrief } from './types/deck'

export default function App() {
  const [view, setView]     = useState<AppView>('intake')
  const [intake, setIntake] = useState<IntakeData | null>(null)
  const [brief, setBrief]   = useState<CompanyBrief | null>(null)

  const handleBriefGenerated = (i: IntakeData, b: CompanyBrief) => {
    setIntake(i)
    setBrief(b)
    setView('brief')
  }

  const handleStartOver = () => {
    setIntake(null)
    setBrief(null)
    setView('intake')
  }

  if (view === 'intake') {
    return <IntakeForm onBriefGenerated={handleBriefGenerated} />
  }

  if (view === 'brief' && brief && intake) {
    return (
      <BriefView
        intake={intake}
        brief={brief}
        onViewDeck={() => setView('presenter')}
        onStartOver={handleStartOver}
      />
    )
  }

  return (
    <Presenter
      slides={disneyDeck}
      title={intake ? `${intake.clientName} · SIGNAL` : 'Disney AI Enablement · SIGNAL'}
    />
  )
}
