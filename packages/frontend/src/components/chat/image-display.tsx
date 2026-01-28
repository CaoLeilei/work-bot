"use client"

import { useState } from "react"
import { Maximize2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageData } from "@/types/message"

interface ImageDisplayProps {
  data: ImageData
}

export function ImageDisplay({ data }: ImageDisplayProps) {
  const [error, setError] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch(data.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("下载失败:", err)
    }
  }

  const handleError = () => {
    setError(true)
  }

  if (error) {
    return (
      <Card className="w-full">
        <div className="p-4 text-center text-sm text-muted-foreground">
          图片加载失败
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-fit max-w-full">
      <div className="p-4">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer">
              <img
                src={data.url}
                alt={data.alt || "图片"}
                className="rounded-lg max-w-full h-auto"
                style={{
                  maxWidth: "100%",
                  maxHeight: data.height || "400px",
                }}
                onError={handleError}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Maximize2 className="h-6 w-6 text-white" />
                <span className="text-white text-sm">点击放大</span>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <img
              src={data.url}
              alt={data.alt || "图片"}
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>

        <div className="mt-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            下载图片
          </Button>
        </div>
      </div>
    </Card>
  )
}
