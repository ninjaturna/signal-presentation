// In-memory poll response store.
// Replace savePollResponse with a Supabase insert when ready.

export interface PollResponse {
  slideId: string
  deckId?: string
  answer: string | string[]
  respondedAt: Date
}

class PollStore {
  private responses: PollResponse[] = []
  private listeners = new Map<string, Array<() => void>>()

  subscribe(slideId: string, fn: () => void) {
    if (!this.listeners.has(slideId)) this.listeners.set(slideId, [])
    this.listeners.get(slideId)!.push(fn)
    return () => {
      const arr = this.listeners.get(slideId) ?? []
      this.listeners.set(slideId, arr.filter(l => l !== fn))
    }
  }

  private notify(slideId: string) {
    this.listeners.get(slideId)?.forEach(fn => fn())
  }

  save(response: PollResponse) {
    this.responses.push(response)
    this.notify(response.slideId)
    // TODO: replace with Supabase insert
    // await supabase.from('poll_responses').insert(response)
  }

  getResults(slideId: string): Record<string, number> {
    return this.responses
      .filter(r => r.slideId === slideId)
      .reduce((acc, r) => {
        const answers = Array.isArray(r.answer) ? r.answer : [r.answer]
        answers.forEach(a => { acc[a] = (acc[a] ?? 0) + 1 })
        return acc
      }, {} as Record<string, number>)
  }

  getTotalVotes(slideId: string): number {
    return this.responses.filter(r => r.slideId === slideId).length
  }

  hasVoted(slideId: string): boolean {
    return localStorage.getItem(`voted_${slideId}`) === 'true'
  }

  markVoted(slideId: string) {
    localStorage.setItem(`voted_${slideId}`, 'true')
  }

  reset(slideId: string) {
    this.responses = this.responses.filter(r => r.slideId !== slideId)
    localStorage.removeItem(`voted_${slideId}`)
    this.notify(slideId)
  }
}

export const pollStore = new PollStore()
