import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    default:
      "bg-[#2D5A43] text-white hover:bg-[#234735] focus-visible:ring-[#2D5A43] shadow-xs",
    secondary:
      "bg-[#EAE4D9] text-[#2B2824] hover:bg-[#DDD6C9] focus-visible:ring-[#8C8275]",
    outline:
      "border border-[#D8D1C5] bg-[#FFFFFF] text-[#2B2824] hover:bg-[#F5F1E9] hover:border-[#BFB6A8] focus-visible:ring-[#8C8275]",
    ghost:
      "text-[#57524A] hover:bg-[#ECE7DE] hover:text-[#1F1E1C] focus-visible:ring-[#8C8275]",
    danger:
      "bg-[#B91C1C] text-white hover:bg-[#991B1B] focus-visible:ring-[#B91C1C]",
    dangerOutline:
      "border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100 hover:border-red-300",
    subtleGreen:
      "bg-[#E8F0EB] text-[#2D5A43] hover:bg-[#D5E4D9] border border-[#C5DACB]"
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-3.5 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
    icon: "h-9 w-9 p-0"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
