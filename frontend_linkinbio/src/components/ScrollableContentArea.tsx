import { ReactNode } from "react";

interface ScrollableContentAreaProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollableContentArea({ 
  children, 
  className = "" 
}: ScrollableContentAreaProps) {
  return (
    <div className={`scrollable-content ${className}`}>
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}