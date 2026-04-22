import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInvoices } from '../context/InvoiceContext'
import InvoiceForm from '../components/invoice/InvoiceForm'
import StatusBadge from '../components/shared/StatusBadge'
import DeleteModal from '../components/invoice/DeleteModal'

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { invoices, markAsPaid, deleteInvoice } = useInvoices()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const invoice = invoices.find(inv => inv.id === id)

  if (!invoice) {
    return (
      <div className="text-[var(--color-text-primary)] text-center mt-20">
        <p>Invoice not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-[var(--color-primary)] font-bold hover:underline"
        >
          Go back
        </button>
      </div>
    )
  }

  const formattedDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const formattedCurrency = (amount: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    navigate('/')
  }

  const handleMarkAsPaid = () => {
    markAsPaid(invoice.id)
  }

  return (
    <div className="w-full">
      <button
        onClick={() => navigate('/')}
        className="
          flex items-center gap-4 mb-8
          font-bold text-[0.9375rem] text-[var(--color-text-primary)]
          hover:text-[var(--color-text-secondary)]
          bg-transparent border-none cursor-pointer
          transition-colors duration-200
        "
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path
            d="M6 1L2 5l4 4"
            stroke="#7C5DFA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Go back
      </button>

      <div className="
        bg-[var(--color-card)] rounded-lg px-8 py-6 mb-4
        flex items-center justify-between
        shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)]
      ">
        <div className="flex items-center gap-4">
          <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">
            Status
          </span>
          <StatusBadge status={invoice.status} />
        </div>

      
        <div className="hidden md:flex items-center gap-3">
          {invoice.status !== 'paid' && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-secondary"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            Delete
          </button>
          {invoice.status === 'pending' && (
            <button
              onClick={handleMarkAsPaid}
              className="btn btn-primary"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      <div className="
        bg-[var(--color-card)] rounded-lg p-8 md:p-12
        shadow-[0px_10px_10px_-10px_rgba(72,84,159,0.1)]
      ">
        <div className="flex flex-col md:flex-row md:justify-between mb-8 md:mb-16">
          <div>
            <h2 className="font-bold text-[0.9375rem] text-[var(--color-text-primary)] mb-1">
              <span className="text-[var(--color-text-muted)]">#</span>
              {invoice.id}
            </h2>
            <p className="text-[0.8125rem] text-[var(--color-text-secondary)]">
              {invoice.description}
            </p>
          </div>

          <div className="text-[0.8125rem] text-[var(--color-text-secondary)] mt-8 md:mt-0 md:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[0.8125rem] text-[var(--color-text-secondary)] mb-2">
                Invoice Date
              </p>
              <p className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
                {formattedDate(invoice.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-[0.8125rem] text-[var(--color-text-secondary)] mb-2">
                Payment Due
              </p>
              <p className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
                {formattedDate(invoice.paymentDue)}
              </p>
            </div>
          </div>

    
          <div>
            <p className="text-[0.8125rem] text-[var(--color-text-secondary)] mb-2">
              Bill To
            </p>
            <p className="font-bold text-[0.9375rem] text-[var(--color-text-primary)] mb-2">
              {invoice.clientName}
            </p>
            <div className="text-[0.8125rem] text-[var(--color-text-secondary)]">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div>
            <p className="text-[0.8125rem] text-[var(--color-text-secondary)] mb-2">
              Sent To
            </p>
            <p className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-bg)] rounded-lg overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 px-8 py-4">
            <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">Item Name</span>
            <span className="text-[0.8125rem] text-[var(--color-text-secondary)] text-center">QTY.</span>
            <span className="text-[0.8125rem] text-[var(--color-text-secondary)] text-right">Price</span>
            <span className="text-[0.8125rem] text-[var(--color-text-secondary)] text-right">Total</span>
          </div>

          <div className="px-8 py-4 flex flex-col gap-6">
            {invoice.items.map(item => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_80px_120px_120px] gap-4 items-center"
              >
                <span className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
                  {item.name}
                </span>

                <div className="md:hidden text-right">
                  <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">
                    {item.quantity} x {formattedCurrency(item.price)}
                  </span>
                  <p className="font-bold text-[0.9375rem] text-[var(--color-text-primary)]">
                    {formattedCurrency(item.total)}
                  </p>
                </div>

                
                <span className="hidden md:block text-[0.8125rem] text-[var(--color-text-secondary)] text-center">
                  {item.quantity}
                </span>
                <span className="hidden md:block text-[0.8125rem] text-[var(--color-text-secondary)] text-right">
                  {formattedCurrency(item.price)}
                </span>
                <span className="hidden md:block font-bold text-[0.9375rem] text-[var(--color-text-primary)] text-right">
                  {formattedCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>

          <div className="
            bg-[var(--color-total-bar-bg)]
            px-8 py-6 rounded-b-lg
            flex items-center justify-between
          ">
            <span className="text-[0.8125rem] text-white">Amount Due</span>
            <span className="font-bold text-[1.5rem] text-white">
              {formattedCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      <div className="
        md:hidden fixed bottom-0 left-0 right-0
        bg-[var(--color-card)] px-6 py-5
        flex items-center justify-end gap-3
        shadow-[0px_-10px_10px_-10px_rgba(72,84,159,0.1)]
      ">
        {invoice.status !== 'paid' && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-secondary"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-danger"
        >
          Delete
        </button>
        {invoice.status === 'pending' && (
          <button
            onClick={handleMarkAsPaid}
            className="btn btn-primary"
          >
            Mark as Paid
          </button>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        invoiceId={invoice.id}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />




<InvoiceForm
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  invoice={invoice}
/>

    </div>
  )
}