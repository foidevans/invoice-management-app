import { useState, useMemo } from "react";
import { useInvoices } from "../context/InvoiceContext";
import type { InvoiceStatus } from "../types/invoice";
import InvoiceCard from "../components/invoice/InvoiceCard";
import FilterDropdown from "../components/shared/FilterDropdown";
import EmptyState from "../components/shared/EmptyState";
import InvoiceForm from "../components/invoice/InvoiceForm";

export default function InvoicesPage() {
  const { invoices } = useInvoices();
  const [selectedFilters, setSelectedFilters] = useState<InvoiceStatus[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredInvoices = useMemo(() => {
    if (selectedFilters.length === 0) return invoices;
    return invoices.filter((inv) => selectedFilters.includes(inv.status));
  }, [invoices, selectedFilters]);

  const subtitle = useMemo(() => {
    const count = filteredInvoices.length;

    if (count === 0) return "No invoices";

    if (selectedFilters.length === 1) {
      return `There ${count === 1 ? "is" : "are"} ${count} ${selectedFilters[0]} ${count === 1 ? "invoice" : "invoices"}`;
    }

    return `There ${count === 1 ? "is" : "are"} ${count} total ${count === 1 ? "invoice" : "invoices"}`;
  }, [filteredInvoices, selectedFilters]);

  return (
    <div className="w-full max-w-[780px] mx-auto">
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: "60px" }}
      >
        <div>
          <h1 className="font-bold text-[2rem] tracking-[-1px] text-[var(--color-text-primary)] leading-tight">
            Invoices
          </h1>
          <p className="text-[0.8125rem] text-[var(--color-text-secondary)] mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <FilterDropdown
            selected={selectedFilters}
            onChange={setSelectedFilters}
          />

          {/* New Invoice button */}
          <button
            onClick={() => setIsFormOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "var(--color-primary)",
              borderRadius: "24px",
              border: "none",
              cursor: "pointer",
              padding: "8px 16px 8px 8px",
              color: "white",
              fontFamily: "League Spartan, sans-serif",
              fontWeight: 700,
              fontSize: "0.9375rem",
              whiteSpace: "nowrap",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            <span
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M5.5 1v9M1 5.5h9"
                  stroke="#7C5DFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="hidden md:inline">New Invoice</span>
            <span className="md:hidden">New</span>
          </button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col ">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}

      <InvoiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
