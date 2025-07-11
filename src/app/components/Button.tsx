import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = "primary",
  disabled = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-2 rounded-md font-medium transition";
  const variantStyles = {
    primary: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
