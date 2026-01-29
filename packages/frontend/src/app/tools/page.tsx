"use client"

import { useState } from "react"
import { Search, Code2, FileText, Image, Calculator, Calendar, MessageSquare, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const tools = [
  {
    id: 1,
    name: "代码生成器",
    description: "根据需求描述自动生成代码片段",
    icon: <Code2 className="h-6 w-6" />,
    category: "开发",
    popular: true,
  },
  {
    id: 2,
    name: "文档助手",
    description: "智能辅助编写和优化文档内容",
    icon: <FileText className="h-6 w-6" />,
    category: "写作",
    popular: true,
  },
  {
    id: 3,
    name: "图片处理",
    description: "图片格式转换、压缩、裁剪等处理工具",
    icon: <Image className="h-6 w-6" />,
    category: "图像",
    popular: false,
  },
  {
    id: 4,
    name: "计算器",
    description: "支持复杂数学运算和科学计算",
    icon: <Calculator className="h-6 w-6" />,
    category: "工具",
    popular: false,
  },
  {
    id: 5,
    name: "日程管理",
    description: "智能日程安排和提醒功能",
    icon: <Calendar className="h-6 w-6" />,
    category: "效率",
    popular: true,
  },
  {
    id: 6,
    name: "对话摘要",
    description: "提取对话关键信息和生成摘要",
    icon: <MessageSquare className="h-6 w-6" />,
    category: "AI",
    popular: true,
  },
  {
    id: 7,
    name: "时间追踪",
    description: "记录和分析时间使用情况",
    icon: <Clock className="h-6 w-6" />,
    category: "效率",
    popular: false,
  },
  {
    id: 8,
    name: "快捷指令",
    description: "自定义快捷命令提高工作效率",
    icon: <Zap className="h-6 w-6" />,
    category: "工具",
    popular: true,
  },
]

const categories = ["全部", "开发", "写作", "图像", "工具", "效率", "AI"]

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularTools = tools.filter((t) => t.popular)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">常用工具</h1>
        <p className="text-muted-foreground">使用各种工具提升你的工作效率</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          热门工具
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-primary">{tool.icon}</div>
                  <Badge variant="secondary" className="text-xs">热门</Badge>
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">
          {selectedCategory === "全部" ? "全部工具" : selectedCategory}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <Card
              key={tool.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-primary">{tool.icon}</div>
                  <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            未找到符合条件的工具
          </div>
        )}
      </div>
    </div>
  )
}
