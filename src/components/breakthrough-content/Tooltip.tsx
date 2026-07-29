import { useState } from 'react'

interface Props {
  text: string
  children: React.ReactNode
}

export default function Tooltip({ text, children }: Props) {
  const [show, setShow] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-1.5 w-4 h-4 rounded-full bg-gray-700 text-gray-400 text-xs flex items-center justify-center hover:bg-gray-600 hover:text-white transition-colors"
      >
        ?
      </button>
      {show && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 shadow-xl z-50">
          {text}
          <div className="absolute left-4 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  )
}
