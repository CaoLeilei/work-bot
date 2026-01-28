"use client"

import { useState, useRef } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUploadData } from "@/types/message"

interface FileUploadProps {
  data: FileUploadData
  onUpload: (files: File[]) => void
}

export function FileUpload({ data, onUpload }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = data.accept || "*/*"
  const maxSize = data.maxSize || 10 * 1024 * 1024
  const multiple = data.multiple || false

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.size <= maxSize)

    if (validFiles.length < files.length) {
      alert("部分文件超过大小限制")
    }

    setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles)
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles)
      setSelectedFiles([])
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Card className="w-full">
      <div className="p-4">
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-2">点击或拖拽文件到此处上传</p>
          {data.description && (
            <p className="text-xs text-muted-foreground">{data.description}</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">已选择的文件：</p>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <File className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleUpload} className="w-full">
              上传文件
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
