import { useNavigate } from 'react-router-dom'
import type { Invoice } from '../../types/invoice'
import StatusBadge from '../shared/StatusBadge'

interface InvoiceCardProps {
  invoice: Invoice
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const navigate = useNavigate()

  const formattedDate = new Date(invoice.paymentDue).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const formattedTotal = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(invoice.total)

  return (
    <>
      <div
        onClick={() => navigate(`/invoices/${invoice.id}`)}
        className="
          hidden lg:grid
          grid-cols-[100px_1fr_1fr_1fr_120px_20px]
          items-center gap-4
          bg-[var(--color-card)] rounded-lg px-8 py-4
          cursor-pointer border border-transparent
          hover:border-[var(--color-primary)]
          transition-all duration-200
          shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)]
        "
      >
        <span className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
          <span className="text-[var(--color-text-muted)]">#</span>
          {invoice.id}
        </span>

        <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">
          Due {formattedDate}
        </span>

        <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">
          {invoice.clientName}
        </span>

        <span className="font-bold text-[1rem] text-[var(--color-text-primary)] text-right">
          {formattedTotal}
        </span>

        <StatusBadge status={invoice.status} />

        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div
        onClick={() => navigate(`/invoices/${invoice.id}`)}
        className="
          lg:hidden
          bg-[var(--color-card)] rounded-lg p-6
          cursor-pointer border border-transparent
          hover:border-[var(--color-primary)]
          transition-all duration-200
          shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)]
        "
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
            <span className="text-[var(--color-text-muted)]">#</span>
            {invoice.id}
          </span>
          <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">
            {invoice.clientName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">
              Due {formattedDate}
            </span>
            <span className="font-bold text-[1rem] text-[var(--color-text-primary)]">
              {formattedTotal}
            </span>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </>
  )
}