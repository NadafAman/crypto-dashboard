import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-md border border-gray-800 bg-gray-900 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-300 transition-all ease-in-out duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props} // This spreads the rest of the props, including placeholder, value, onChange, etc.
      />
    );
  }
);

Input.displayName = "Input"; // Adding displayName to improve debugging in React DevTools
