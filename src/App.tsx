import './styles/globals.css'
import { Presenter } from './components/Presenter'
import { disneyDeck } from './data/disney-deck'

export default function App() {
  return <Presenter slides={disneyDeck} title="Disney AI Enablement · SIGNAL" />
}
