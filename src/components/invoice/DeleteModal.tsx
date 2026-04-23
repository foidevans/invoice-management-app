import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

interface DeleteModalProps {
  isOpen: boolean;
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  isOpen,
  invoiceId,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent
        style={{
          maxWidth: "480px",
          padding: "32px 24px",
          backgroundColor: "var(--color-card)",
          border: "none",
          outline: "none",
          borderRadius: "8px",
          boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
          width: "90vw",
        }}
        className="[&>button]:hidden [&]:border-none [&]:outline-none"
      >
        <DialogHeader>
          <DialogTitle
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              marginBottom: "12px",
              fontFamily: "League Spartan, sans-serif",
            }}
          >
            Confirm Deletion
          </DialogTitle>
          <DialogDescription
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-secondary)",
              lineHeight: "1.85",
              fontFamily: "League Spartan, sans-serif",
            }}
          >
            Are you sure you want to delete invoice #{invoiceId}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "24px",
          }}
        >
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
