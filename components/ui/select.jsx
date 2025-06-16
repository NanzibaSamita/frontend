"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange, ...props }) => {
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange }))}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }) => (
  <span className={cn("block truncate", !value && "text-gray-500")}>{value || placeholder}</span>
)

const SelectContent = ({ children, value, onValueChange }) => (
  <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md">
    {React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange }))}
  </div>
)

const SelectItem = ({ children, value: itemValue, value, onValueChange, className, ...props }) => (
  <div
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
      className,
    )}
    onClick={() => onValueChange && onValueChange(itemValue)}
    {...props}
  >
    {children}
  </div>
)

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
