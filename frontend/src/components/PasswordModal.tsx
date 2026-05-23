import { useState } from "react";

interface Props {
  title: string;
  onConfirm: (password: string) => Promise<void>;
  onCancel: () => void;
}

export default function PasswordModal({ title, onConfirm, onCancel }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError("");
    try {
      await onConfirm(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wrong password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete "{title}"?</h3>
        <p>Enter password to confirm</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {error && <span className="modal-error">{error}</span>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-delete" disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
