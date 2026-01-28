"use client"

import { useState } from "react"
import { Copy, Check, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface JsonDisplayProps {
  data: any
}

type JsonNode = {
  key?: string
  value: any
  type: "object" | "array" | "string" | "number" | "boolean" | "null"
}

export function JsonDisplay({ data }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleExpand = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderValue = (value: any, path: string = "") => {
    if (value === null) {
      return <span className="text-purple-600 dark:text-purple-400">null</span>
    }

    if (typeof value === "boolean") {
      return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
    }

    if (typeof value === "number") {
      return <span className="text-orange-600 dark:text-orange-400">{value}</span>
    }

    if (typeof value === "string") {
      return <span className="text-green-600 dark:text-green-400">"{value}"</span>
    }

    if (Array.isArray(value)) {
      const isExpanded = expanded.has(path)
      return (
        <div className="ml-4">
          <button
            onClick={() => toggleExpand(path)}
            className="flex items-center gap-1 text-xs font-medium hover:opacity-70"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span>Array({value.length})</span>
          </button>
          {isExpanded && (
            <div className="ml-4">
              {value.map((item, index) => (
                <div key={index} className="py-0.5">
                  {renderValue(item, `${path}[${index}]`)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    if (typeof value === "object") {
      const isExpanded = expanded.has(path)
      const keys = Object.keys(value)
      return (
        <div className="ml-4">
          <button
            onClick={() => toggleExpand(path)}
            className="flex items-center gap-1 text-xs font-medium hover:opacity-70"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span>Object{"{"}{keys.length}{"}"}</span>
          </button>
          {isExpanded && (
            <div className="ml-4">
              {keys.map((key) => (
                <div key={key} className="py-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {key}:
                  </span>{" "}
                  {renderValue(value[key], `${path}.${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-sm font-medium">JSON</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="p-4 overflow-auto max-h-96">
        <pre className="text-sm font-mono">
          {renderValue(data, "root")}
        </pre>
      </div>
    </Card>
  )
}
