import React, { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => Promise<void> | void; // peut être async
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function Button(props: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!props.onClick) return;
    try {
      setLoading(true);
      await props.onClick(); // support async or sync
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type={props.type ?? "button"}
      disabled={loading || (props.disabled ?? false)}
      className={props.className ?? "btn btn-success"}
      onClick={handleClick}
    >
      {loading ? `⏳${props.children}` : props.children}
    </button>
  );
}