import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "icon" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  active?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", active = false, className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full transition-all duration-300 font-medium";

  const variants = {
    primary: "bg-nest-btn text-white hover:bg-neutral-800",
    secondary: "bg-white text-nest-text hover:bg-gray-100",
    icon: "bg-white text-nest-text hover:bg-gray-100 shadow-sm",
    outline: "border border-gray-300 text-nest-text hover:bg-gray-50",
  };

  const activeStyles = active ? "bg-nest-btn text-white shadow-md ring-2 ring-offset-2 ring-gray-200" : "";
  const activeIconStyles = active && variant === "icon" ? "!bg-nest-btn !text-white" : "";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "w-12 h-12 p-0 flex items-center justify-center", // Perfect circle
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${activeStyles} ${activeIconStyles} ${className}`}
      {...props}
    >
      {children}

    </button>
  );
};

export default Button;
