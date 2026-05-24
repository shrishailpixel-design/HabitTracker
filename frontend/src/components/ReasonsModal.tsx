import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function ReasonsModal({ onClose }: Props) {
  const [reasons, setReasons] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("quit-reasons");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");

  const save = (updated: string[]) => {
    setReasons(updated);
    localStorage.setItem("quit-reasons", JSON.stringify(updated));
  };

  const addReason = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    save([...reasons, trimmed]);
    setInput("");
  };

  const removeReason = (index: number) => {
    save(reasons.filter((_, i) => i !== index));
  };

  const alertRandom = () => {
    if (reasons.length === 0) {
      alert("Add some reasons first — why did you start?");
      return;
    }
    const r = reasons[Math.floor(Math.random() * reasons.length)];
    alert(r);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal reasons-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Why I Quit</h3>
        <p>Reasons to remember when you feel like giving in.</p>

        <button className="alert-btn" onClick={alertRandom}>
          ⚠️ Alert me
        </button>

        <div className="reasons-list">
          {reasons.length === 0 && (
            <p className="reasons-empty">No reasons yet. Add one below.</p>
          )}
          {reasons.map((reason, i) => (
            <div key={i} className="reason-item">
              <span>{reason}</span>
              <button
                className="reason-remove"
                onClick={() => removeReason(i)}
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="reasons-add">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addReason()}
            placeholder="Add a reason..."
          />
          <button onClick={addReason} disabled={!input.trim()}>
            Add
          </button>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
