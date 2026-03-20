import { createContext, useContext } from 'react'

interface EditGateContextValue {
  markEdited: () => void
}

export const EditGateContext = createContext<EditGateContextValue>({
  markEdited: () => {},
})

export function useEditGate() {
  return useContext(EditGateContext)
}
