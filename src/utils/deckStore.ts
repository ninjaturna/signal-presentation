import type { SlideData } from '../types/deck'

export interface StoredDeck {
  id: string
  title: string
  clientName: string
  createdAt: Date
  slideCount: number
  slides: SlideData[]
  isDemo?: boolean
}

// In-memory store — persists for the session
// Future: replace with Supabase or localStorage
class DeckStore {
  private decks: StoredDeck[] = []
  private listeners: Array<() => void> = []

  subscribe(fn: () => void) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter(l => l !== fn) }
  }

  private notify() {
    this.listeners.forEach(fn => fn())
  }

  getAll(): StoredDeck[] {
    return [...this.decks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  get(id: string): StoredDeck | undefined {
    return this.decks.find(d => d.id === id)
  }

  add(deck: Omit<StoredDeck, 'id' | 'createdAt'>): StoredDeck {
    const stored: StoredDeck = {
      ...deck,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    this.decks.unshift(stored)
    this.notify()
    return stored
  }

  update(id: string, slides: SlideData[]) {
    this.decks = this.decks.map(d =>
      d.id === id ? { ...d, slides, slideCount: slides.length } : d
    )
    this.notify()
  }

  remove(id: string) {
    this.decks = this.decks.filter(d => d.id !== id)
    this.notify()
  }

  rename(id: string, title: string) {
    this.decks = this.decks.map(d => d.id === id ? { ...d, title } : d)
    this.notify()
  }
}

export const deckStore = new DeckStore()
