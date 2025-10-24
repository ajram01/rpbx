// app/owner/listings/_client/ListingActions.tsx
"use client";
import React from "react";

export function ConfirmOnSubmit({ children, message }: { children: React.ReactNode; message: string }) {
  return (
    <span
      onClick={(e) => {
        const ok = window.confirm(message);
        if (!ok) { e.preventDefault(); e.stopPropagation(); }
      }}
    >
      {children}
    </span>
  );
}
