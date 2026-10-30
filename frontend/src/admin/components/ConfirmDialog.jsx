import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmDialog.css';

export default function ConfirmDialog({ title, message, confirmLabel = 'Yes', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  // Esc closes the box, like the Cancel button
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  // rendered on <body>: inside the phone sidebar (which slides with a transform) a fixed box would be placed wrongly
  return createPortal(
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
        <span className="material-symbols-outlined confirm-icon" aria-hidden="true">logout</span>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} autoFocus>{cancelLabel}</button>
          <button type="button" className="btn" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
