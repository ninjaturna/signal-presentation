// SIGNAL Error Code Taxonomy v1.0
// Every user-visible error in the co-pilot and edit panel
// references a code from this file.

export type SignalErrorCode =
  // 1xx — Slide content errors
  | 'SIG-101' // NO_DATA_TO_WORK_WITH
  | 'SIG-102' // SLIDE_TYPE_MISMATCH
  | 'SIG-103' // INSUFFICIENT_CONTENT
  | 'SIG-104' // STAT_NOT_FOUND
  | 'SIG-105' // FIELD_NOT_PRESENT
  | 'SIG-106' // NOTHING_CHANGED
  // 2xx — Input errors
  | 'SIG-201' // INSTRUCTION_TOO_VAGUE
  | 'SIG-202' // INSTRUCTION_CONFLICTING
  | 'SIG-203' // INSTRUCTION_OUT_OF_SCOPE
  // 3xx — Infrastructure errors
  | 'SIG-301' // API_KEY_MISSING
  | 'SIG-302' // API_TIMEOUT
  | 'SIG-303' // API_RATE_LIMIT
  | 'SIG-304' // API_PARSE_FAILURE
  | 'SIG-305' // API_UNKNOWN
  // 4xx — Permission errors
  | 'SIG-401' // READ_ONLY_MODE
  | 'SIG-402' // SLIDE_LOCKED

export interface SignalError {
  code: SignalErrorCode
  name: string
  message: string           // user-facing message
  hint?: string             // optional actionable recovery hint
  severity: 'info' | 'warning' | 'error'
}

export const SIGNAL_ERRORS: Record<SignalErrorCode, SignalError> = {
  'SIG-101': {
    code: 'SIG-101',
    name: 'NO_DATA_TO_WORK_WITH',
    message: "This slide doesn't have what you're looking for.",
    hint: 'Try a different instruction, or add content manually first.',
    severity: 'info',
  },
  'SIG-102': {
    code: 'SIG-102',
    name: 'SLIDE_TYPE_MISMATCH',
    message: "That edit doesn't apply to this slide type.",
    hint: 'Switch to a different slide type in the Edit panel, or try a different instruction.',
    severity: 'info',
  },
  'SIG-103': {
    code: 'SIG-103',
    name: 'INSUFFICIENT_CONTENT',
    message: "There's not enough content on this slide to do that.",
    hint: 'Add more text or data first, then try again.',
    severity: 'info',
  },
  'SIG-104': {
    code: 'SIG-104',
    name: 'STAT_NOT_FOUND',
    message: "No stat found on this slide.",
    hint: 'This slide needs at least one stat value. Add one in Edit mode, then ask me to refine it.',
    severity: 'info',
  },
  'SIG-105': {
    code: 'SIG-105',
    name: 'FIELD_NOT_PRESENT',
    message: "This slide type doesn't have that field.",
    hint: 'Try a different slide type or a different instruction.',
    severity: 'info',
  },
  'SIG-106': {
    code: 'SIG-106',
    name: 'NOTHING_CHANGED',
    message: "I wasn't able to improve on what's already there.",
    hint: 'Try being more specific — or use the Rewrite Tone picker for a different approach.',
    severity: 'info',
  },
  'SIG-201': {
    code: 'SIG-201',
    name: 'INSTRUCTION_TOO_VAGUE',
    message: "I need more detail to do that.",
    hint: 'What specifically should change? Name the field and the direction.',
    severity: 'warning',
  },
  'SIG-202': {
    code: 'SIG-202',
    name: 'INSTRUCTION_CONFLICTING',
    message: "That instruction seems to contradict itself.",
    hint: 'Try breaking it into two separate requests.',
    severity: 'warning',
  },
  'SIG-203': {
    code: 'SIG-203',
    name: 'INSTRUCTION_OUT_OF_SCOPE',
    message: "I can only edit slide content.",
    hint: 'For layout changes, use the Edit panel. For new slides, ask me to "add a slide after this one".',
    severity: 'warning',
  },
  'SIG-301': {
    code: 'SIG-301',
    name: 'API_KEY_MISSING',
    message: "AI co-pilot isn't configured.",
    hint: 'Add ANTHROPIC_API_KEY to your Vercel environment variables, then redeploy.',
    severity: 'error',
  },
  'SIG-302': {
    code: 'SIG-302',
    name: 'API_TIMEOUT',
    message: "The request timed out.",
    hint: 'Try a simpler instruction, or wait a moment and try again.',
    severity: 'error',
  },
  'SIG-303': {
    code: 'SIG-303',
    name: 'API_RATE_LIMIT',
    message: "Too many requests right now.",
    hint: 'Wait a moment and try again.',
    severity: 'warning',
  },
  'SIG-304': {
    code: 'SIG-304',
    name: 'API_PARSE_FAILURE',
    message: "The AI returned something unexpected.",
    hint: 'Try again. If this keeps happening, simplify your instruction.',
    severity: 'error',
  },
  'SIG-305': {
    code: 'SIG-305',
    name: 'API_UNKNOWN',
    message: "An unexpected error occurred.",
    hint: 'Try again. If it persists, check the Vercel function logs.',
    severity: 'error',
  },
  'SIG-401': {
    code: 'SIG-401',
    name: 'READ_ONLY_MODE',
    message: "This deck is in view-only mode.",
    hint: 'Switch to Edit mode to make changes.',
    severity: 'info',
  },
  'SIG-402': {
    code: 'SIG-402',
    name: 'SLIDE_LOCKED',
    message: "This slide can't be edited.",
    severity: 'info',
  },
}

export function getSignalError(code: SignalErrorCode): SignalError {
  return SIGNAL_ERRORS[code]
}

export function classifyApiError(error: string, statusCode?: number): SignalErrorCode {
  if (statusCode === 401 || error.includes('API_KEY') || error.includes('api_key')) return 'SIG-301'
  if (statusCode === 429 || error.includes('rate_limit') || error.includes('rate limit')) return 'SIG-303'
  if (statusCode === 408 || error.includes('timeout') || error.includes('timed out')) return 'SIG-302'
  if (error.includes('parse') || error.includes('JSON') || error.includes('unexpected token')) return 'SIG-304'
  return 'SIG-305'
}
