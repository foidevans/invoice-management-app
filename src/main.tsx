import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { InvoiceProvider } from "./context/InvoiceContext";
import InvoicesPage from "./pages/InvoicePage";
import InvoiceDetailPage from './pages/InvoiceDetailPage'

const router = createBrowserRouter([
   {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <InvoicesPage /> },
      { path: 'invoices/:id', element: <InvoiceDetailPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <InvoiceProvider>
        <RouterProvider router={router} />
      </InvoiceProvider>
    </ThemeProvider>
  </React.StrictMode>,
);