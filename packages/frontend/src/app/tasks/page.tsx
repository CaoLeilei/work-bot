'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Calendar, User, Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const tasks = [
  {
    id: 1,
    title: '完成项目需求文档',
    description: '整理和编写项目需求规格说明书',
    status: 'in-progress',
    priority: 'high',
    assignee: '张三',
    dueDate: '2024-02-01',
    project: '工作助手',
  },
  {
    id: 2,
    title: '设计数据库表结构',
    description: '根据需求文档设计数据库ER图和表结构',
    status: 'todo',
    priority: 'high',
    assignee: '李四',
    dueDate: '2024-02-03',
    project: '工作助手',
  },
  {
    id: 3,
    title: '前端页面开发',
    description: '开发首页、设置页和项目管理页面',
    status: 'in-progress',
    priority: 'medium',
    assignee: '王五',
    dueDate: '2024-02-05',
    project: '工作助手',
  },
  {
    id: 4,
    title: 'API 接口对接',
    description: '完成后端 API 接口开发和文档编写',
    status: 'todo',
    priority: 'medium',
    assignee: '赵六',
    dueDate: '2024-02-07',
    project: '工作助手',
  },
  {
    id: 5,
    title: '编写测试用例',
    description: '编写单元测试和集成测试',
    status: 'completed',
    priority: 'low',
    assignee: '张三',
    dueDate: '2024-01-28',
    project: '工作助手',
  },
]

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'in-progress':
        return '进行中'
      default:
        return '待办'
    }
  }

  const getStatusBadge = (status: string) => {
    const variant = {
      completed: 'default',
      'in-progress': 'secondary',
      todo: 'outline',
    }[status] as any
    return <Badge variant={variant}>{getStatusText(status)}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variant = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline',
    }[priority] as any
    const text = { high: '高', medium: '中', low: '低' }[priority]
    return <Badge variant={variant}>{text}</Badge>
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo')
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress')
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed')

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">任务管理</h1>
            <p className="text-muted-foreground">管理和跟踪你的任务进度</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新建任务
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新建任务</DialogTitle>
                <DialogDescription>填写任务信息以创建新任务</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">任务标题</Label>
                  <Input id="task-title" placeholder="输入任务标题" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-desc">任务描述</Label>
                  <Textarea id="task-desc" placeholder="输入任务描述" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">优先级</Label>
                    <Select>
                      <SelectTrigger id="task-priority">
                        <SelectValue placeholder="选择优先级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-due">截止日期</Label>
                    <Input id="task-due" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>创建任务</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索任务..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="todo">待办</SelectItem>
                <SelectItem value="in-progress">进行中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="board" className="w-full">
        <TabsList>
          <TabsTrigger value="board">看板视图</TabsTrigger>
          <TabsTrigger value="list">列表视图</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Circle className="h-4 w-4" />
                    待办
                  </span>
                  <Badge variant="outline">{todoTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todoTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm flex-1">{task.title}</h3>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {todoTasks.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">暂无待办任务</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    进行中
                  </span>
                  <Badge variant="secondary">{inProgressTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {inProgressTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm flex-1">{task.title}</h3>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {inProgressTasks.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">暂无进行中任务</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    已完成
                  </span>
                  <Badge variant="default">{completedTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm flex-1">{task.title}</h3>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">暂无已完成任务</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(task.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{task.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(task.status)}
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="text-sm text-muted-foreground min-w-[150px]">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">暂无符合条件的任务</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
