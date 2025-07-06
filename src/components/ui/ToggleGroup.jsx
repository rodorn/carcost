import * as React from "react";
export function ToggleGroup({ type, defaultValue, onValueChange, children }) {
  const [selected, setSelected] = React.useState(defaultValue);
  const handleClick = (val) => {
    setSelected(val);
    onValueChange && onValueChange(val);
  };
  return (
    <div className="flex gap-1">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          selected,
          onClick: () => handleClick(child.props.value),
        })
      )}
    </div>
  );
}
export function ToggleGroupItem({ value, children, selected, onClick }) {
  return (
    <button
      className={
        "px-3 py-1 rounded-lg border " +
        (selected == value ? "bg-blue-600 text-white border-blue-800" : "bg-gray-200 border-gray-400") +
        " transition"
      }
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
