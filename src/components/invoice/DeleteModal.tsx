import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'

interface DeleteModalProps {
  isOpen: boolean
  invoiceId: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({
  isOpen,
  invoiceId,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-[480px] p-12 bg-[var(--color-card)] border-none rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-[1.5rem] font-bold text-[var(--color-text-primary)] mb-3">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-[0.8125rem] text-[var(--color-text-secondary)] leading-6">
            Are you sure you want to delete invoice #{invoiceId}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}