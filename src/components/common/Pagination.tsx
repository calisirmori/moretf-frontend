import React from 'react'

type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const getDisplayPages = () => {
    const pages: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        if (pages.length > 0 && typeof pages[pages.length - 1] === 'number' && i - (pages[pages.length - 1] as number) > 1) {
          pages.push('...')
        }
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <div className="flex justify-center items-center gap-1 mt-6 text-sm">
      <button
        className="px-2 py-1 rounded bg-light-200 dark:bg-warm-600 disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹ Prev
      </button>

      {getDisplayPages().map((p, idx) =>
        typeof p === 'number' ? (
          <button
            key={idx}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded ${
              currentPage === p
                ? 'bg-brand-orange text-white font-bold'
                : 'bg-light-300 dark:bg-warm-600 hover:bg-light-400 dark:hover:bg-warm-500'
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="px-2">
            ...
          </span>
        )
      )}

      <button
        className="px-2 py-1 rounded bg-light-200 dark:bg-warm-600 disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ›
      </button>
    </div>
  )
}
