import { useState } from 'react'
export function Select({ children, value, onValueChange }) {
  return (
    <div className="relative">
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  )
}
