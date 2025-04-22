export function Badge({ children, className }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-sm ${className}`}>
      {children}
    </span>
  )
}
