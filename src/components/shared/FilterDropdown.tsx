import { useState, useRef, useEffect } from 'react'
import type { InvoiceStatus } from '../../types/invoice'

interface FilterDropdownProps {
  selected: InvoiceStatus[]
  onChange: (selected: InvoiceStatus[]) => void
}

const OPTIONS: InvoiceStatus[] = ['draft', 'pending', 'paid']

export default function FilterDropdown({ selected, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (status: InvoiceStatus) => {
    if (selected.includes(status)) {
      onChange(selected.filter(s => s !== status))
    } else {
      onChange([...selected, status])
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="
          flex items-center gap-3
          font-bold text-[0.9375rem] text-[var(--color-text-primary)]
          bg-transparent border-none cursor-pointer
          hover:text-[var(--color-primary)]
          transition-colors duration-200
        "
      >
        <span className="hidden md:inline">Filter by status</span>
        <span className="md:hidden">Filter</span>

        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1l4.5 4.5L10 1"
            stroke="#7C5DFA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="
          absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2
          w-[192px] bg-[var(--color-card)]
          rounded-lg p-6 flex flex-col gap-4
          shadow-[0px_10px_20px_rgba(72,84,159,0.25)]
          z-50
        ">
          {OPTIONS.map(status => (
            <label
              key={status}
              className="flex items-center gap-4 cursor-pointer group"
            >
              <div
                onClick={() => toggleOption(status)}
                className={`
                  w-4 h-4 rounded-sm border flex items-center justify-center
                  transition-all duration-200 flex-shrink-0
                  ${selected.includes(status)
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-input-bg)] group-hover:border-[var(--color-primary)]'
                  }
                `}
              >
                {selected.includes(status) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              <span className="
                font-bold text-[0.9375rem] text-[var(--color-text-primary)]
                capitalize
              ">
                {status}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}