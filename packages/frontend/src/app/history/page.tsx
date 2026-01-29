"use client"

import { useState } from "react"
import { Search, Clock, MessageSquare, FileCode, FileText, Image as ImageIcon, Trash2, Download, PlayCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const historyItems = [
  {
    id: 1,
    title: "生成项目需求文档",
    description: "为工作助手项目生成详细的需求规格说明书",
    type: "chat",
    content: "智能对话",
    timestamp: "2024-01-29 14:32:15",
    duration: "5分23秒",
    status: "completed",
  },
  {
    id: 2,
    title: "编写 API 接口代码",
    description: "生成用户认证和项目管理的 API 接口代码",
    type: "code",
    content: "代码生成",
    timestamp: "2024-01-29 13:45:00",
    duration: "3分12秒",
    status: "completed",
  },
  {
    id: 3,
    title: "优化数据库查询",
    description: "分析并优化项目列表查询的性能",
    type: "code",
    content: "代码优化",
    timestamp: "2024-01-29 11:20:30",
    duration: "2分45秒",
    status: "completed",
  },
  {
    id: 4,
    title: "撰写项目周报",
    description: "根据本周工作内容生成项目进度周报",
    type: "document",
    content: "文档生成",
    timestamp: "2024-01-28 16:50:00",
    duration: "1分58秒",
    status: "completed",
  },
  {
    id: 5,
    title: "图片格式转换",
    description: "将项目截图从 PNG 转换为 JPEG 格式",
    type: "image",
    content: "图片处理",
    timestamp: "2024-01-28 15:30:00",
    duration: "30秒",
    status: "completed",
  },
  {
    id: 6,
    title: "数据分析脚本",
    description: "生成数据分析脚本，统计项目使用情况",
    type: "code",
    content: "代码生成",
    timestamp: "2024-01-28 10:15:00",
    duration: "4分10秒",
    status: "completed",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "chat":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "code":
      return <FileCode className="h-4 w-4 text-green-500" />
    case "document":
      return <FileText className="h-4 w-4 text-yellow-500" />
    case "image":
      return <ImageIcon className="h-4 w-4 text-purple-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getTypeBadge = (type: string) => {
  const colors = {
    chat: "bg-blue-500/10 text-blue-500",
    code: "bg-green-500/10 text-green-500",
    document: "bg-yellow-500/10 text-yellow-500",
    image: "bg-purple-500/10 text-purple-500",
  }
  return <Badge className={colors[type as keyof typeof colors] || "bg-gray-500/10 text-gray-500"}>
    {historyItems.find((h) => h.type === type)?.content || type}
  </Badge>
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalDuration = historyItems.reduce((acc, item) => {
    const match = item.duration.match(/(\d+)分(\d+)秒/) || item.duration.match(/(\d+)秒/)
    if (match) {
      const minutes = parseInt(match[1]) || 0
      const seconds = parseInt(match[2]) || 0
      return acc + minutes * 60 + seconds
    }
    return acc
  }, 0)

  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}小时${minutes}分`
    }
    if (minutes > 0) {
      return `${minutes}分钟${secs}秒`
    }
    return `${secs}秒`
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">执行历史</h1>
        <p className="text-muted-foreground">查看和管理你的操作历史记录</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">列表视图</TabsTrigger>
          <TabsTrigger value="stats">统计概览</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索历史记录..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="chat">智能对话</SelectItem>
                    <SelectItem value="code">代码生成</SelectItem>
                    <SelectItem value="document">文档生成</SelectItem>
                    <SelectItem value="image">图片处理</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {getTypeIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTypeBadge(item.type)}
                        <Badge variant="outline" className="whitespace-nowrap">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.duration}
                        </Badge>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {item.timestamp}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    未找到符合条件的历史记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardDescription>总执行次数</CardDescription>
                <CardTitle className="text-3xl">{historyItems.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>总执行时长</CardDescription>
                <CardTitle className="text-3xl">{formatTotalDuration(totalDuration)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>今日执行</CardDescription>
                <CardTitle className="text-3xl">
                  {historyItems.filter((h) => h.timestamp.startsWith("2024-01-29")).length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>执行统计</CardTitle>
              <CardDescription>按类型统计执行情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["chat", "code", "document", "image"].map((type) => {
                  const items = historyItems.filter((h) => h.type === type)
                  const count = items.length
                  const percentage = (count / historyItems.length) * 100
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(type)}
                          <span className="font-medium">
                            {historyItems.find((h) => h.type === type)?.content}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {count} 次 ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
