export function Button({ children, className, ...props }) {
  return (
    <button
      className={
        "bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-6 text-lg font-semibold shadow " +
        (className || "")
      }
      {...props}
    >
      {children}
    </button>
  );
}
