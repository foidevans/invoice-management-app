import type { InvoiceStatus } from '../../types/invoice'

interface StatusBadgeProps {
  status: InvoiceStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    paid: 'text-[#33D69F] bg-[#33D69F]/10',
    pending: 'text-[#FF8F00] bg-[#FF8F00]/10',
    draft: 'text-[#373B53] bg-[#373B53]/10 dark:text-[#DFE3FA] dark:bg-[#DFE3FA]/10',
  }

  const label = {
    paid: 'Paid',
    pending: 'Pending',
    draft: 'Draft',
  }

    return (
    <div
      className={`flex items-center justify-center gap-2 font-bold text-[0.9375rem] rounded-md ${styles[status]}`}
      style={{ width: '104px', height: '40px' }}
    >
      <span className="w-2 h-2 rounded-full bg-current" />
      {label[status]}
    </div>
  )
}