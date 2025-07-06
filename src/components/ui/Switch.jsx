import * as React from "react";
export function Switch({ checked, onCheckedChange }) {
  const [isChecked, setIsChecked] = React.useState(checked || false);
  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    onCheckedChange && onCheckedChange(e.target.checked);
  };
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 relative transition-all"></div>
    </label>
  );
}
