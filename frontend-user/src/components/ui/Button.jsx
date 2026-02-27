export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-6 py-2 rounded font-semibold transition-colors";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-600/70 text-white hover:bg-gray-600",
    white: "bg-white text-black hover:bg-gray-200",
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
