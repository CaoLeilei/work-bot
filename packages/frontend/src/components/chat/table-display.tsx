"use client"

import { Card } from "@/components/ui/card"
import { TableData } from "@/types/message"

interface TableDisplayProps {
  data: TableData
}

export function TableDisplay({ data }: TableDisplayProps) {
  return (
    <Card className="w-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-0"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
