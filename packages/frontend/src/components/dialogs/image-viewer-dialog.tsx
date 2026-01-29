"use client"

import { useState } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ImageViewerDialogProps {
  trigger?: React.ReactNode
  src: string
  alt?: string
  onDownload?: () => void
}

export function ImageViewerDialog({
  trigger,
  src,
  alt = "图片",
  onDownload,
}: ImageViewerDialogProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
  }

  const handleDownload = () => {
    if (onDownload) {
      onDownload()
    } else {
      const link = document.createElement("a")
      link.href = src
      link.download = `image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const defaultTrigger = <Button variant="outline">查看图片</Button>

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* 顶部工具栏 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2 border shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
            >
              重置
            </Button>
          </div>

          {/* 关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-sm"
            onClick={() => {
              setScale(1)
              setRotation(0)
            }}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* 下载按钮 */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-4 right-4 z-10 bg-background/90 backdrop-blur-sm"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" />
          </Button>

          {/* 图片容器 */}
          <div className="flex-1 overflow-auto flex items-center justify-center bg-muted/30">
            <img
              src={src}
              alt={alt}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease-out",
              }}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
