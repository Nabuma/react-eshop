import type { CSSProperties } from 'react';
import { Heart, HeartOff, ShoppingBasket } from 'lucide-react';
import './Toast.css';

type ToastProps = {
  kind: 'added' | 'removed';
  message: string;
  durationMs: number;
  onCancel: () => void;
  icon?: 'heart' | 'basket';
};

export function Toast({ kind, message, durationMs, onCancel, icon = 'heart' }: ToastProps) {
  return (
    <div
      className={`toast toast-${kind}`}
      role="status"
      style={{ '--toast-duration': `${durationMs}ms` } as CSSProperties}
    >
      {icon === 'basket' ? (
        <ShoppingBasket className="toast-icon" aria-hidden="true" />
      ) : kind === 'added' ? (
        <Heart className="toast-icon" fill="currentColor" aria-hidden="true" />
      ) : (
        <HeartOff className="toast-icon" aria-hidden="true" />
      )}
      <span className="toast-message">{message}</span>
      <button className="toast-action" onClick={onCancel}>
        Cancel
      </button>
      <span className="toast-progress" aria-hidden="true" />
    </div>
  );
}
