"use client";

import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };

export function DropdownMenu({ children, ...props }: Props) {
  return (
    <div className="relative inline-block" {...props}>
      {children}
    </div>
  );
}

export const DropdownMenuTrigger = ({ children, asChild, ...props }: any) => {
  // asChild is supported in shadcn components; here we simply render children inside a span
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props);
  }
  return (
    <button type="button" className="inline-flex items-center" {...props}>
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ children, className = "", ...props }: any) => {
  return (
    <div
      className={`absolute right-0 z-50 mt-2 w-56 rounded-md border bg-popover p-1 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, className = "", ...props }: any) => {
  return (
    <div
      role="menuitem"
      tabIndex={0}
      className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className = "", ...props }: any) => (
  <div className={`px-3 py-2 text-xs font-medium uppercase text-muted-foreground ${className}`} {...props}>
    {children}
  </div>
);

export const DropdownMenuSeparator = ({ className = "", ...props }: any) => (
  <div className={`my-1 h-px bg-border ${className}`} {...props} />
);

export default DropdownMenu;

