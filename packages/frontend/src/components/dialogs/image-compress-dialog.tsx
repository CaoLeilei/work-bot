"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon, FileImage, Download, Trash2, CheckCircle } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

interface ImageFile {
  id: string
  file: File
  preview: string
  originalSize: number
  compressedSize: number
  compression: number
  status: "pending" | "processing" | "completed"
}

export function ImageCompressDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState<ImageFile[]>([])
  const [compressionLevel, setCompressionLevel] = useState([70])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

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
          originalSize: file.size,
          compressedSize: file.size,
          compression: 0,
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

  const compressImage = async (imageFile: ImageFile): Promise<void> => {
    setImages(prev =>
      prev.map(img =>
        img.id === imageFile.id ? { ...img, status: "processing" } : img
      )
    )

    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const scale = Math.min(1, (compressionLevel[0] / 100) * 0.9 + 0.1)

        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

        const quality = compressionLevel[0] / 100
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)

        canvas.toBlob((blob) => {
          if (blob) {
            setImages(prev =>
              prev.map(img =>
                img.id === imageFile.id
                  ? {
                      ...img,
                      compressedSize: blob.size,
                      compression: Math.round((1 - blob.size / img.originalSize) * 100),
                      status: "completed",
                    }
                  : img
              )
            )
          }
          resolve()
        }, "image/jpeg", quality)
      }
      img.src = imageFile.preview
    })
  }

  const compressAll = async () => {
    for (const image of images) {
      if (image.status !== "completed") {
        await compressImage(image)
      }
    }
  }

  const downloadImage = (image: ImageFile) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const quality = compressionLevel[0] / 100
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      const link = document.createElement("a")
      link.download = `${image.file.name.replace(/\.[^/.]+$/, "")}_compressed.jpg`
      link.href = canvas.toDataURL("image/jpeg", quality)
      link.click()
    }
    img.src = image.preview
  }

  const downloadAll = async () => {
    for (const image of images) {
      if (image.status === "completed") {
        downloadImage(image)
      }
    }
  }

  const defaultTrigger = <Button variant="default" className="w-full">打开工具</Button>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>图片压缩</DialogTitle>
          <DialogDescription>
            上传图片，智能压缩减小文件体积
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
              <p className="text-xs text-muted-foreground">支持 JPG、PNG、WebP 格式</p>
            </CardContent>
          </Card>

          {/* 压缩设置 */}
          {images.length > 0 && (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">压缩质量</span>
                  <span className="text-sm text-muted-foreground">{compressionLevel[0]}%</span>
                </div>
                <Slider
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>最小体积</span>
                  <span>最高质量</span>
                </div>
              </CardContent>
            </Card>
          )}

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
                            原大小: {formatSize(image.originalSize)}
                          </p>
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

                    {image.status === "completed" ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">压缩后</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {formatSize(image.compressedSize)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">压缩率</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {image.compression}%
                            </span>
                          </div>
                          <Progress value={image.compression} className="h-2" />
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => downloadImage(image)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          下载
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => compressImage(image)}
                        disabled={image.status === "processing"}
                      >
                        {image.status === "processing" ? "处理中..." : "压缩"}
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
              <Button onClick={compressAll}>
                <CheckCircle className="h-4 w-4 mr-2" />
                压缩全部
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
