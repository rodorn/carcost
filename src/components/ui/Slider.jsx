import * as React from "react";
export function Slider({ min = 0, max = 100, step = 1, defaultValue = [0], onValueChange, className }) {
  const [value, setValue] = React.useState(defaultValue);
  const handleChange = (e) => {
    const val = [parseFloat(e.target.value)];
    setValue(val);
    onValueChange && onValueChange(val);
  };
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={"w-full accent-blue-500 " + (className || "")}
    />
  );
}
