import { Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] overflow-hidden">
      <Sidebar />
      <main
        style={{
          marginLeft: "var(--sidebar-width)",
          marginTop: "var(--topnav-height)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "48px 24px",
          width: "calc(100% - var(--sidebar-width))",
        }}
      >
        <div style={{ width: "100%", maxWidth: "780px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
