"use client"

import { useState, useRef } from "react"
import { Upload, X, Download, FileImage, CheckCircle, Image as ImageIcon, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImageFile {
  id: string
  file: File
  preview: string
  originalFormat: string
  targetFormat: string
  status: "pending" | "converting" | "completed"
  convertedDataUrl?: string
}

const formatOptions = [
  { value: "image/jpeg", label: "JPEG", icon: "🖼️" },
  { value: "image/png", label: "PNG", icon: "📷" },
  { value: "image/webp", label: "WebP", icon: "🌐" },
  { value: "image/gif", label: "GIF", icon: "🎬" },
  { value: "image/bmp", label: "BMP", icon: "🎨" },
]

export function ImageConvertDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    addImages(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addImages(files)
  }

  const addImages = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          originalFormat: file.type,
          targetFormat: "image/jpeg",
          status: "pending",
        }
        setImages(prev => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const convertImage = async (imageFile: ImageFile): Promise<void> => {
    setImages(prev =>
      prev.map(img =>
        img.id === imageFile.id ? { ...img, status: "converting" } : img
      )
    )

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        ctx?.drawImage(img, 0, 0)

        let mimeType = imageFile.targetFormat
        let quality = 0.92

        const convertedDataUrl = canvas.toDataURL(mimeType, quality)

        setImages(prev =>
          prev.map(img =>
            img.id === imageFile.id
              ? {
                  ...img,
                  status: "completed",
                  convertedDataUrl,
                }
              : img
          )
        )
        resolve()
      }
      img.src = imageFile.preview
    })
  }

  const convertAll = async () => {
    for (const image of images) {
      if (image.status !== "completed") {
        await convertImage(image)
      }
    }
  }

  const downloadImage = (image: ImageFile) => {
    if (!image.convertedDataUrl) return

    const format = image.targetFormat.split("/")[1].toUpperCase()
    const link = document.createElement("a")
    link.download = `${image.file.name.replace(/\.[^/.]+$/, "")}_converted.${format.toLowerCase()}`
    link.href = image.convertedDataUrl
    link.click()
  }

  const downloadAll = async () => {
    for (const image of images) {
      if (image.status === "completed") {
        downloadImage(image)
      }
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const defaultTrigger = <Button variant="default" className="w-full">打开工具</Button>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>图片格式转换</DialogTitle>
          <DialogDescription>
            将图片转换为不同格式，支持批量转换
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* 上传区域 */}
          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">拖拽图片到这里</p>
              <p className="text-sm text-muted-foreground mb-4">或点击选择文件</p>
              <p className="text-xs text-muted-foreground">
                支持 JPG、PNG、WebP、GIF、BMP 等格式
              </p>
            </CardContent>
          </Card>

          {/* 图片列表 */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={image.preview}
                          alt={image.file.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{image.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            大小: {formatSize(image.file.size)}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <ImageIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {image.originalFormat.split("/")[1].toUpperCase()}
                            </span>
                            <span className="text-muted-foreground">→</span>
                            <span className="text-xs font-medium">
                              {formatOptions.find(f => f.value === image.targetFormat)?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {/* 格式选择 */}
                    <Select
                      value={image.targetFormat}
                      onValueChange={(value) => {
                        setImages(prev =>
                          prev.map(img =>
                            img.id === image.id ? { ...img, targetFormat: value, status: "pending" } : img
                          )
                        )
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {formatOptions.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            <span className="flex items-center gap-2">
                              <span>{format.icon}</span>
                              <span>{format.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 转换或下载按钮 */}
                    {image.status === "completed" ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        下载
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => convertImage(image)}
                        disabled={image.status === "converting"}
                      >
                        {image.status === "converting" ? "转换中..." : "转换"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        {images.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              已选择 {images.length} 张图片
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setImages([])}>
                清空
              </Button>
              <Button onClick={convertAll}>
                <CheckCircle className="h-4 w-4 mr-2" />
                转换全部
              </Button>
              {images.some(img => img.status === "completed") && (
                <Button onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  下载全部
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
