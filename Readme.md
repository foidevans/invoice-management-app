# Invoice Management App

A full-stack invoice management application built with React, TypeScript, and Node.js. Designed and developed as part of the HNG Internship Stage 2 task.

**Live Demo:** [https://invoice-management-app-b5x5.vercel.app/]
**GitHub:** [https://github.com/foidevans/invoice-management-app]

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Client Setup

```bash
# Clone the repository
git clone [https://github.com/foidevans/invoice-management-app]
cd invoice-management-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Architecture Explanation

### Tech Stack
- **React 19** — UI framework
- **TypeScript** — Type safety across the entire codebase
- **Tailwind CSS v4** — Utility-first styling with CSS custom properties for theming
- **React Router v7** — Client-side routing
- **ShadCN UI** — Used exclusively for the delete confirmation Dialog component
- **Vite** — Build tool and dev server

### Folder Structure
src/
├── components/
│   ├── invoice/          # Invoice-specific components
│   │   ├── InvoiceCard.tsx
│   │   ├── InvoiceDetail.tsx
│   │   ├── InvoiceForm.tsx
│   │   └── DeleteModal.tsx
│   ├── layout/           # App shell components
│   │   └── Sidebar.tsx
│   └── shared/           # Reusable components
│       ├── StatusBadge.tsx
│       ├── FilterDropdown.tsx
│       └── EmptyState.tsx
├── context/
│   ├── ThemeContext.tsx   # Dark/light mode state
│   └── InvoiceContext.tsx # Global invoice state with useReducer
├── data/
│   └── data.json         # Seed data for first load
├── pages/
│   ├── InvoicesPage.tsx
│   └── InvoiceDetailPage.tsx
├── styles/
│   └── global.css        # CSS custom properties and global styles
└── types/
└── invoice.ts        # TypeScript interfaces

### State Management

The app uses React Context with `useReducer` for global invoice state. This pattern was chosen over external libraries like Redux or Zustand because:

- The data model is simple and self-contained
- `useReducer` centralizes all mutation logic in one place
- No additional dependencies required

All invoice CRUD operations are dispatched as typed actions to the reducer:

```typescript
dispatch({ type: 'ADD_INVOICE', payload: newInvoice })
dispatch({ type: 'DELETE_INVOICE', payload: id })
dispatch({ type: 'MARK_AS_PAID', payload: id })
```

### Data Persistence

Invoice data is persisted to `localStorage` on every state change via a `useEffect` in `InvoiceContext`. On first load, if no data exists in localStorage, the app seeds from `data.json`. This gives the app a working dataset out of the box.

### Routing

Two routes are defined:
- `/` — Invoice list page
- `/invoices/:id` — Invoice detail page

The form (create/edit) is a slide-in panel, not a separate route — it overlays the current page and is controlled by local `isOpen` state.

### Theming

Dark/light mode is implemented using CSS custom properties. The `ThemeContext` toggles a `.dark` class on `document.documentElement`. All color tokens are defined as CSS variables that automatically switch:

```css
:root {
  --color-bg: #F8F8FB;
  --color-card: #FFFFFF;
}

.dark {
  --color-bg: #141625;
  --color-card: #1E2139;
}
```

Theme preference is saved to `localStorage` and restored on page load.

---

## Trade-offs

**LocalStorage over a backend**
The task allowed a Node.js backend, but localStorage was chosen as the persistence layer to reduce deployment complexity and stay focused on frontend quality within the deadline. The architecture is designed so that swapping localStorage for API calls requires only changing the context's data-fetching logic.

**Inline styles over Tailwind for layout**
Tailwind CSS v4 changed how arbitrary values and responsive prefixes work compared to v3. In several layout-critical areas (margins, widths, padding), inline styles were used to guarantee consistent rendering across all browsers and screen sizes without fighting the new compiler.

**ShadCN only for the modal**
ShadCN was scoped to just the delete confirmation dialog. Using it for form inputs and buttons would have required significant style overrides to match the Figma design. Building inputs and buttons from scratch gave more control and a closer match to the design spec.

**No authentication**
Authentication is out of scope for this task. All data is stored locally per browser session. A production version would require user accounts and a proper backend.

---

## Accessibility Notes

- All interactive elements use semantic `<button>` elements, never `<div onClick>`
- Form fields are associated with `<label>` elements
- The delete modal traps focus and can be closed with the `ESC` key (handled by ShadCN Dialog)
- Status badges use both color and text to convey status — not color alone
- The sidebar theme toggle has an `aria-label` of "Toggle theme"
- Color contrast meets WCAG AA standards for both light and dark modes
- The app uses semantic HTML throughout: `<main>`, `<aside>`, `<header>`, `<fieldset>`, `<legend>`

---

## Improvements Beyond Requirements

- **Seed data on first load** — The app ships with 7 realistic invoices so reviewers see a populated UI immediately without needing to create data manually
- **Dynamic subtitle** — The invoice list subtitle updates intelligently based on active filters: "There are 4 pending invoices" vs "There are 7 total invoices"
- **Auto-calculated totals** — Item totals in the form update in real time as quantity and price are changed
- **Payment due auto-calculation** — The payment due date is automatically calculated from the invoice date and selected payment terms
- **Unique ID generation** — Invoice IDs are auto-generated in the format used by the Figma (2 letters + 4 numbers e.g. XM9141)
- **Draft saves skip validation** — Drafts can be saved with incomplete data, matching real-world invoice workflows
- **Responsive across all breakpoints** — Tested at 320px mobile, tablet, and 1440px desktop
- **Persistent dark mode** — Theme preference survives page refreshes via localStorage
- **Hover states on all interactive elements** — Cards, buttons, inputs, filter options and navigation all have visible hover states

---

## Contact

Built by Favour — [foidevans](https://github.com/foidevans)

