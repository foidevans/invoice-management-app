import { useState, useEffect } from 'react'
import { useInvoices } from '../../context/InvoiceContext'
import type { Invoice, InvoiceItem } from '../../types/invoice'

interface InvoiceFormProps {
  isOpen: boolean
  onClose: () => void
  invoice?: Invoice 
}

interface FormData {
  senderStreet: string
  senderCity: string
  senderPostCode: string
  senderCountry: string
  clientName: string
  clientEmail: string
  clientStreet: string
  clientCity: string
  clientPostCode: string
  clientCountry: string
  createdAt: string
  paymentTerms: number
  description: string
}

interface FormErrors {
  [key: string]: string
}

const emptyForm: FormData = {
  senderStreet: '',
  senderCity: '',
  senderPostCode: '',
  senderCountry: '',
  clientName: '',
  clientEmail: '',
  clientStreet: '',
  clientCity: '',
  clientPostCode: '',
  clientCountry: '',
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
}

const emptyItem: InvoiceItem = {
  id: crypto.randomUUID(),
  name: '',
  quantity: 1,
  price: 0,
  total: 0,
}

function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetters = Array.from({ length: 2 }, () =>
    letters[Math.floor(Math.random() * letters.length)]
  ).join('')
  const randomNumbers = Math.floor(1000 + Math.random() * 9000)
  return `${randomLetters}${randomNumbers}`
}

function calculatePaymentDue(createdAt: string, paymentTerms: number): string {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + paymentTerms)
  return date.toISOString().split('T')[0]
}

export default function InvoiceForm({ isOpen, onClose, invoice }: InvoiceFormProps) {
  const { addInvoice, updateInvoice } = useInvoices()
  const isEditMode = !!invoice

  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [items, setItems] = useState<InvoiceItem[]>([{ ...emptyItem }])
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (invoice && isOpen) {
      setFormData({
        senderStreet: invoice.senderAddress.street,
        senderCity: invoice.senderAddress.city,
        senderPostCode: invoice.senderAddress.postCode,
        senderCountry: invoice.senderAddress.country,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientStreet: invoice.clientAddress.street,
        clientCity: invoice.clientAddress.city,
        clientPostCode: invoice.clientAddress.postCode,
        clientCountry: invoice.clientAddress.country,
        createdAt: invoice.createdAt,
        paymentTerms: invoice.paymentTerms,
        description: invoice.description,
      })
      setItems(invoice.items)
    } else if (!invoice && isOpen) {
      setFormData(emptyForm)
      setItems([{ ...emptyItem, id: crypto.randomUUID() }])
      setErrors({})
    }
  }, [invoice, isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      const updated = { ...item, [field]: value }
      if (field === 'quantity' || field === 'price') {
        updated.total = Number(updated.quantity) * Number(updated.price)
      }
      return updated
    }))
    if (errors[`item_${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`item_${index}_${field}`]: '' }))
    }
  }

  const addItem = () => {
    setItems(prev => [...prev, { ...emptyItem, id: crypto.randomUUID() }])
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.senderStreet.trim()) newErrors.senderStreet = "can't be empty"
    if (!formData.senderCity.trim()) newErrors.senderCity = "can't be empty"
    if (!formData.senderPostCode.trim()) newErrors.senderPostCode = "can't be empty"
    if (!formData.senderCountry.trim()) newErrors.senderCountry = "can't be empty"
    if (!formData.clientName.trim()) newErrors.clientName = "can't be empty"
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "can't be empty"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'invalid email'
    }
    if (!formData.clientStreet.trim()) newErrors.clientStreet = "can't be empty"
    if (!formData.clientCity.trim()) newErrors.clientCity = "can't be empty"
    if (!formData.clientPostCode.trim()) newErrors.clientPostCode = "can't be empty"
    if (!formData.clientCountry.trim()) newErrors.clientCountry = "can't be empty"
    if (!formData.description.trim()) newErrors.description = "can't be empty"

    if (items.length === 0) {
      newErrors.items = 'An item must be added'
    }

    items.forEach((item, index) => {
      if (!item.name.trim()) newErrors[`item_${index}_name`] = "can't be empty"
      if (item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'must be > 0'
      if (item.price <= 0) newErrors[`item_${index}_price`] = 'must be > 0'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const buildInvoice = (status: 'pending' | 'draft'): Invoice => {
    const total = items.reduce((sum, item) => sum + item.total, 0)
    return {
      id: invoice?.id ?? generateId(),
      createdAt: formData.createdAt,
      paymentDue: calculatePaymentDue(formData.createdAt, formData.paymentTerms),
      description: formData.description,
      paymentTerms: formData.paymentTerms,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      status,
      senderAddress: {
        street: formData.senderStreet,
        city: formData.senderCity,
        postCode: formData.senderPostCode,
        country: formData.senderCountry,
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry,
      },
      items,
      total,
    }
  }

  const handleSaveAsDraft = () => {
    const newInvoice = buildInvoice('draft')
    addInvoice(newInvoice)
    onClose()
  }

  const handleSaveAndSend = () => {
    if (!validate()) return
    const newInvoice = buildInvoice('pending')
    addInvoice(newInvoice)
    onClose()
  }

  const handleSaveChanges = () => {
    if (!validate()) return
    const updatedInvoice = buildInvoice(invoice!.status as 'pending' | 'draft')
    updateInvoice(updatedInvoice)
    onClose()
  }

  const hasErrors = Object.values(errors).some(e => e !== '')

  return (
    <>
      <div
        className={`fixed inset-0 z-[99] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'var(--color-overlay)' }}
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 left-0 h-full z-[100]
          bg-[var(--color-bg)] overflow-y-auto
          transition-transform duration-300
          w-full md:w-[616px] lg:w-[719px]
          lg:left-[103px] lg:rounded-r-[20px]
        `}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(-120%)',
           visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        <div className="px-6 py-8 md:px-14 md:py-12">
          <h2 className="font-bold text-[1.5rem] text-[var(--color-text-primary)] mb-10 tracking-[-0.5px]">
            {isEditMode ? (
              <>Edit <span className="text-[var(--color-text-muted)]">#</span>{invoice.id}</>
            ) : (
              'New Invoice'
            )}
          </h2>

          <fieldset className="mb-10">
            <legend className="text-[0.9375rem] font-bold text-[var(--color-primary)] mb-6">
              Bill From
            </legend>

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">
                    Street Address
                  </label>
                  {errors.senderStreet && (
                    <span className="text-[0.8125rem] text-[var(--color-danger)]">
                      {errors.senderStreet}
                    </span>
                  )}
                </div>
                <input
                  className={`input ${errors.senderStreet ? 'error' : ''}`}
                  value={formData.senderStreet}
                  onChange={e => handleChange('senderStreet', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">City</label>
                    {errors.senderCity && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.senderCity}</span>}
                  </div>
                  <input
                    className={`input ${errors.senderCity ? 'error' : ''}`}
                    value={formData.senderCity}
                    onChange={e => handleChange('senderCity', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Post Code</label>
                    {errors.senderPostCode && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.senderPostCode}</span>}
                  </div>
                  <input
                    className={`input ${errors.senderPostCode ? 'error' : ''}`}
                    value={formData.senderPostCode}
                    onChange={e => handleChange('senderPostCode', e.target.value)}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex justify-between mb-2">
                    <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Country</label>
                    {errors.senderCountry && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.senderCountry}</span>}
                  </div>
                  <input
                    className={`input ${errors.senderCountry ? 'error' : ''}`}
                    value={formData.senderCountry}
                    onChange={e => handleChange('senderCountry', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="mb-10">
            <legend className="text-[0.9375rem] font-bold text-[var(--color-primary)] mb-6">
              Bill To
            </legend>

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Client's Name</label>
                  {errors.clientName && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.clientName}</span>}
                </div>
                <input
                  className={`input ${errors.clientName ? 'error' : ''}`}
                  value={formData.clientName}
                  onChange={e => handleChange('clientName', e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Client's Email</label>
                  {errors.clientEmail && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.clientEmail}</span>}
                </div>
                <input
                  type="email"
                  className={`input ${errors.clientEmail ? 'error' : ''}`}
                  value={formData.clientEmail}
                  onChange={e => handleChange('clientEmail', e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Street Address</label>
                  {errors.clientStreet && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.clientStreet}</span>}
                </div>
                <input
                  className={`input ${errors.clientStreet ? 'error' : ''}`}
                  value={formData.clientStreet}
                  onChange={e => handleChange('clientStreet', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">City</label>
                    {errors.clientCity && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.clientCity}</span>}
                  </div>
                  <input
                    className={`input ${errors.clientCity ? 'error' : ''}`}
                    value={formData.clientCity}
                    onChange={e => handleChange('clientCity', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Post Code</label>
                    {errors.clientPostCode && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.clientPostCode}</span>}
                  </div>
                  <input
                    className={`input ${errors.clientPostCode ? 'error' : ''}`}
                    value={formData.clientPostCode}
                    onChange={e => handleChange('clientPostCode', e.target.value)}
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex justify-between mb-2">
                    <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">Country</label>
                    {errors.clientCountry && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.clientCountry}</span>}
                  </div>
                  <input
                    className={`input ${errors.clientCountry ? 'error' : ''}`}
                    value={formData.clientCountry}
                    onChange={e => handleChange('clientCountry', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)] block mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.createdAt}
                    disabled={isEditMode}
                    onChange={e => handleChange('createdAt', e.target.value)}
                    style={{ colorScheme: 'auto' }}
                  />
                </div>
                <div>
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)] block mb-2">
                    Payment Terms
                  </label>
                  <select
                    className="input cursor-pointer"
                    value={formData.paymentTerms}
                    onChange={e => handleChange('paymentTerms', Number(e.target.value))}
                  >
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[0.8125rem] text-[var(--color-text-secondary)]">
                    Project Description
                  </label>
                  {errors.description && <span className="text-[0.8125rem] text-[var(--color-danger)]">{errors.description}</span>}
                </div>
                <input
                  className={`input ${errors.description ? 'error' : ''}`}
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <div className="mb-10">
            <h3 className="text-[1.125rem] font-bold text-[#777F98] mb-6">Item List</h3>

            <div className="hidden md:grid grid-cols-[1fr_60px_100px_80px_24px] gap-4 mb-4">
              <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">Item Name</span>
              <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">Qty.</span>
              <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">Price</span>
              <span className="text-[0.8125rem] text-[var(--color-text-secondary)]">Total</span>
              <span />
            </div>

            <div className="flex flex-col gap-6">
              {items.map((item, index) => (
                <div key={item.id}>
                  <label className="md:hidden text-[0.8125rem] text-[var(--color-text-secondary)] block mb-2">
                    Item Name
                  </label>
                  <div className="grid grid-cols-[1fr_24px] md:grid-cols-[1fr_60px_100px_80px_24px] gap-4 items-center">
                    <div className="col-span-1">
                      <input
                        className={`input ${errors[`item_${index}_name`] ? 'error' : ''}`}
                        value={item.name}
                        onChange={e => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Item name"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="md:hidden flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                        <path d="M11.583 3.556H8.944V2.61A1.611 1.611 0 007.333 1H5.667a1.611 1.611 0 00-1.611 1.61v.946H1.417a.5.5 0 000 1h.278l.5 9.278A1.5 1.5 0 003.69 15h5.617a1.5 1.5 0 001.496-1.166l.5-9.278h.278a.5.5 0 100-1zM5.056 2.61a.611.611 0 01.611-.61h1.666a.611.611 0 01.611.61v.946H5.056V2.61zm5.122 10.668a.5.5 0 01-.499.389H3.69a.5.5 0 01-.499-.389L2.7 4.556h7.6l-.122 8.722z" fill="currentColor"/>
                      </svg>
                    </button>

                    <div className="hidden md:block">
                      <input
                        className={`input text-center ${errors[`item_${index}_quantity`] ? 'error' : ''}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div className="hidden md:block">
                      <input
                        className={`input ${errors[`item_${index}_price`] ? 'error' : ''}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={e => handleItemChange(index, 'price', Number(e.target.value))}
                      />
                    </div>
                    <div className="hidden md:flex items-center">
                      <span className="font-bold text-[0.9375rem] text-[var(--color-text-secondary)]">
                        {item.total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="hidden md:flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                        <path d="M11.583 3.556H8.944V2.61A1.611 1.611 0 007.333 1H5.667a1.611 1.611 0 00-1.611 1.61v.946H1.417a.5.5 0 000 1h.278l.5 9.278A1.5 1.5 0 003.69 15h5.617a1.5 1.5 0 001.496-1.166l.5-9.278h.278a.5.5 0 100-1zM5.056 2.61a.611.611 0 01.611-.61h1.666a.611.611 0 01.611.61v.946H5.056V2.61zm5.122 10.668a.5.5 0 01-.499.389H3.69a.5.5 0 01-.499-.389L2.7 4.556h7.6l-.122 8.722z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>

                  <div className="md:hidden grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-[0.8125rem] text-[var(--color-text-secondary)] block mb-2">Qty.</label>
                      <input
                        className={`input text-center ${errors[`item_${index}_quantity`] ? 'error' : ''}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-[0.8125rem] text-[var(--color-text-secondary)] block mb-2">Price</label>
                      <input
                        className={`input ${errors[`item_${index}_price`] ? 'error' : ''}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={e => handleItemChange(index, 'price', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="
                w-full mt-6 py-4 rounded-[24px]
                bg-[var(--color-border)] hover:bg-[var(--color-input-border)]
                dark:bg-[#252945] dark:hover:bg-[#0C0E16]
                text-[0.9375rem] font-bold text-[var(--color-text-muted)]
                transition-colors duration-200
              "
            >
              + Add New Item
            </button>
          </div>

          {hasErrors && (
            <div className="mb-6">
              {errors.items && (
                <p className="text-[0.8125rem] text-[var(--color-danger)] mb-1">
                  - {errors.items}
                </p>
              )}
              <p className="text-[0.8125rem] text-[var(--color-danger)]">
                - All fields must be added
              </p>
            </div>
          )}

          <div className={`flex items-center gap-3 ${isEditMode ? 'justify-end' : 'justify-between'}`}>
            {isEditMode ? (
              <>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="button" onClick={handleSaveChanges} className="btn btn-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Discard
                </button>
                <div className="flex gap-3">
                  <button type="button" onClick={handleSaveAsDraft} className="btn btn-dark">
                    Save as Draft
                  </button>
                  <button type="button" onClick={handleSaveAndSend} className="btn btn-primary">
                    Save & Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}