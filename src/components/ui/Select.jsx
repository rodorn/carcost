import * as React from "react";
export function Select({ defaultValue, onValueChange, children }) {
  return (
    <select
      defaultValue={defaultValue}
      onChange={e => onValueChange && onValueChange(e.target.value)}
      className="border rounded-lg px-3 py-2"
    >
      {children}
    </select>
  );
}
export function SelectTrigger({ children }) { return children; }
export function SelectValue({ children }) { return children; }
export function SelectContent({ children }) { return children; }
export function SelectItem({ value, children }) { return <option value={value}>{children}</option>; }
