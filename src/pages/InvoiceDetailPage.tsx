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
    {/* GO BACK */}
    <button
      onClick={() => navigate('/')}
      style={{ marginBottom: '32px' }}
      className="flex items-center gap-4 font-bold text-[0.9375rem] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] bg-transparent border-none cursor-pointer transition-colors duration-200"
    >
      <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
        <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Go back
    </button>

    {/* STATUS BAR */}
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: '8px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        boxShadow: '0px 10px 10px -10px rgba(72,84,159,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
          Status
        </span>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="hidden md:flex items-center gap-3">
        {invoice.status !== 'paid' && (
          <button onClick={() => setIsFormOpen(true)} className="btn btn-secondary">
            Edit
          </button>
        )}
        <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">
          Delete
        </button>
        {invoice.status === 'pending' && (
          <button onClick={handleMarkAsPaid} className="btn btn-primary">
            Mark as Paid
          </button>
        )}
      </div>
    </div>

    {/* INVOICE BODY */}
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: '8px',
        padding: '48px',
        boxShadow: '0px 10px 10px -10px rgba(72,84,159,0.1)',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px' }}>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>#</span>{invoice.id}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            {invoice.description}
          </p>
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
          <p>{invoice.senderAddress.street}</p>
          <p>{invoice.senderAddress.city}</p>
          <p>{invoice.senderAddress.postCode}</p>
          <p>{invoice.senderAddress.country}</p>
        </div>
      </div>

      {/* Middle row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Invoice Date</p>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
              {formattedDate(invoice.createdAt)}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Payment Due</p>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
              {formattedDate(invoice.paymentDue)}
            </p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Bill To</p>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
            {invoice.clientName}
          </p>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
            <p>{invoice.clientAddress.street}</p>
            <p>{invoice.clientAddress.city}</p>
            <p>{invoice.clientAddress.postCode}</p>
            <p>{invoice.clientAddress.country}</p>
          </div>
        </div>

        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Sent To</p>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary) ', wordBreak: 'break-all'}}>
            {invoice.clientEmail}
          </p>
          
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div style={{ borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 120px 120px',
          gap: '16px',
          padding: '16px 32px',
        }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Item Name</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>QTY.</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>Price</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>Total</span>
        </div>

        {/* Items */}
        <div style={{ padding: '0 32px 32px' }}>
          {invoice.items.map(item => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 120px 120px',
                gap: '16px',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                {item.name}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textAlign: 'right' }}>
                {formattedCurrency(item.price)}
              </span>
              <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)', textAlign: 'right' }}>
                {formattedCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>

        {/* Amount Due */}
        <div style={{
          backgroundColor: 'var(--color-total-bar-bg)',
          padding: '24px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '0 0 8px 8px',
        }}>
          <span style={{ fontSize: '0.8125rem', color: 'white' }}>Amount Due</span>
          <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'white' }}>
            {formattedCurrency(invoice.total)}
          </span>
        </div>
      </div>
    </div>

    {/* MOBILE ACTION BUTTONS */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-card)] px-6 py-5 flex items-center justify-end gap-3"
      style={{ boxShadow: '0px -10px 10px -10px rgba(72,84,159,0.1)' }}
    >
      {invoice.status !== 'paid' && (
        <button onClick={() => setIsFormOpen(true)} className="btn btn-secondary">Edit</button>
      )}
      <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">Delete</button>
      {invoice.status === 'pending' && (
        <button onClick={handleMarkAsPaid} className="btn btn-primary">Mark as Paid</button>
      )}
    </div>

    {/* DELETE MODAL */}
    <DeleteModal
      isOpen={showDeleteModal}
      invoiceId={invoice.id}
      onConfirm={handleDelete}
      onCancel={() => setShowDeleteModal(false)}
    />

    {/* EDIT FORM */}
    <InvoiceForm
      isOpen={isFormOpen}
      onClose={() => setIsFormOpen(false)}
      invoice={invoice}
    />
  </div>
)
}