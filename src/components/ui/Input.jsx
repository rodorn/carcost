export function Input(props) {
  return (
    <input
      {...props}
      className={
        "border rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 " +
        (props.className || "")
      }
    />
  );
}
