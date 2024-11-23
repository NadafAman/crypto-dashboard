// components/ui/card.tsx
import * as React from "react";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900 shadow-lg hover:shadow-2xl transition-all ease-in-out duration-300 transform hover:scale-105 ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-6 pt-4 bg-sky-600 rounded-lg shadow-md text-white ${className}`}
      {...props}
    />
  );
}
