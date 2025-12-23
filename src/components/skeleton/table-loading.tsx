import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function TableLoading() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {Array.from({ length: 6 }).map((_, index) => (
              <th key={index} className="p-4 text-left">
                <Skeleton className="h-5 w-24 rounded-sm" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <Skeleton className="h-5 w-full rounded-sm" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
