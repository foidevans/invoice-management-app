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
    <div className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-[0.9375rem] w-[104px] justify-center ${styles[status]}`}>
      <span className={`w-2 h-2 rounded-full bg-current`} />
      {label[status]}
    </div>
  )
}