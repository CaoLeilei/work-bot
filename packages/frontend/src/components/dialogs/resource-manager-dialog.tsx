"use client"

import { useState } from "react"
import {
  File,
  Folder,
  Search,
  Upload,
  Download,
  Trash2,
  MoreVertical,
  Image,
  FileText,
  FileVideo,
  FileAudio,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ResourceFile {
  id: string
  name: string
  type: "image" | "document" | "video" | "audio" | "folder"
  size: number
  url?: string
  children?: ResourceFile[]
  createdAt: Date
}

interface ResourceManagerDialogProps {
  trigger?: React.ReactNode
  onUpload?: (files: File[]) => void
  onDelete?: (fileId: string) => void
  onDownload?: (file: ResourceFile) => void
}

const mockFiles: ResourceFile[] = [
  {
    id: "1",
    name: "文档资料",
    type: "folder",
    size: 0,
    createdAt: new Date("2026-01-15"),
    children: [
      {
        id: "1-1",
        name: "项目说明.pdf",
        type: "document",
        size: 1024 * 500,
        createdAt: new Date("2026-01-15"),
      },
      {
        id: "1-2",
        name: "API 文档.docx",
        type: "document",
        size: 1024 * 200,
        createdAt: new Date("2026-01-16"),
      },
    ],
  },
  {
    id: "2",
    name: "设计资源",
    type: "folder",
    size: 0,
    createdAt: new Date("2026-01-10"),
    children: [
      {
        id: "2-1",
        name: "logo.png",
        type: "image",
        size: 1024 * 50,
        url: "/placeholder-logo.png",
        createdAt: new Date("2026-01-10"),
      },
    ],
  },
  {
    id: "3",
    name: "宣传视频.mp4",
    type: "video",
    size: 1024 * 1024 * 50,
    createdAt: new Date("2026-01-08"),
  },
  {
    id: "4",
    name: "背景音乐.mp3",
    type: "audio",
    size: 1024 * 1024 * 5,
    createdAt: new Date("2026-01-05"),
  },
]

export function ResourceManagerDialog({
  trigger,
  onUpload,
  onDelete,
  onDownload,
}: ResourceManagerDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [files, setFiles] = useState<ResourceFile[]>(mockFiles)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "-"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (type: ResourceFile["type"]) => {
    switch (type) {
      case "folder":
        return <Folder className="h-5 w-5 text-blue-500" />
      case "image":
        return <Image className="h-5 w-5 text-green-500" />
      case "video":
        return <FileVideo className="h-5 w-5 text-purple-500" />
      case "audio":
        return <FileAudio className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "folder" && file.type === "folder") ||
      (activeTab === "files" && file.type !== "folder")
    return matchesSearch && matchesTab
  })

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && onUpload) {
        onUpload(Array.from(target.files))
      }
    }
    input.click()
  }

  const defaultTrigger = <Button variant="outline">资源管理</Button>

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            资源管理
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpload}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              上传文件
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索资源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">全部</TabsTrigger>
              <TabsTrigger value="files">文件</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="flex-1 overflow-hidden mt-4">
              {/* 文件列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[500px]">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="group relative p-4 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 shrink-0">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(file.size)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* 操作菜单 */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {file.type !== "folder" && (
                            <DropdownMenuItem
                              onClick={() => onDownload?.(file)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              下载
                            </DropdownMenuItem>
                          )}
                          {file.type === "folder" && (
                            <DropdownMenuItem>
                              <File className="h-4 w-4 mr-2" />
                              打开
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => onDelete?.(file.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {filteredFiles.length === 0 && (
                  <div className="col-span-full py-12 text-center text-muted-foreground">
                    <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>暂无资源</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
