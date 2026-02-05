import { useState } from "react";

export default function ReadMore({
  text = "",
  maxChars = 200,
  className = "",
}) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const shouldTruncate = text.length > maxChars;
  const preview = shouldTruncate
    ? text.slice(0, maxChars).trimEnd() + "…"
    : text;

  return (
    <div className={className}>
      <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>
        {expanded || !shouldTruncate ? text : preview}
      </p>
      {shouldTruncate && (
        <button
          type="button"
          className="btn btn-link p-0"
          onClick={() => setExpanded((s) => !s)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
