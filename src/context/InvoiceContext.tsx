import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import type { Invoice, InvoiceStatus } from '../types/invoice'
import seedData from '../data/data.json'

type InvoiceAction =
  | { type: 'LOAD_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'MARK_AS_PAID'; payload: string }
  | { type: 'CHANGE_STATUS'; payload: { id: string; status: InvoiceStatus } }

interface InvoiceContextType {
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (invoice: Invoice) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
}

function invoiceReducer(state: Invoice[], action: InvoiceAction): Invoice[] {
  switch (action.type) {
    case 'LOAD_INVOICES':
      return action.payload
    case 'ADD_INVOICE':
      return [...state, action.payload]
    case 'UPDATE_INVOICE':
      return state.map(inv => inv.id === action.payload.id ? action.payload : inv)
    case 'DELETE_INVOICE':
      return state.filter(inv => inv.id !== action.payload)
    case 'MARK_AS_PAID':
      return state.map(inv => inv.id === action.payload ? { ...inv, status: 'paid' } : inv)
    default:
      return state
  }
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, dispatch] = useReducer(invoiceReducer, [], () => {
    const saved = localStorage.getItem('invoices')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.length > 0) return parsed
    }
    return seedData as Invoice[]
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (invoice: Invoice) => dispatch({ type: 'ADD_INVOICE', payload: invoice })
  const updateInvoice = (invoice: Invoice) => dispatch({ type: 'UPDATE_INVOICE', payload: invoice })
  const deleteInvoice = (id: string) => dispatch({ type: 'DELETE_INVOICE', payload: id })
  const markAsPaid = (id: string) => dispatch({ type: 'MARK_AS_PAID', payload: id })

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}>
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (context === undefined) {
    throw new Error('useInvoices must be used inside InvoiceProvider')
  }
  return context
}