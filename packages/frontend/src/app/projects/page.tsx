'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  MoreVertical,
  FolderOpen,
  Settings,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Archive,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Project {
  id: string
  name: string
  description: string
  icon?: string
  status: 'active' | 'archived'
  members: number
  createdAt: Date
  updatedAt: Date
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: '前端管理系统',
    description: '基于 React 和 TypeScript 的企业级管理系统',
    icon: '🚀',
    status: 'active',
    members: 5,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    name: '移动端 APP',
    description: '使用 React Native 开发的跨平台应用',
    icon: '📱',
    status: 'active',
    members: 3,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '3',
    name: '数据可视化平台',
    description: '基于 D3.js 的数据分析展示平台',
    icon: '📊',
    status: 'active',
    members: 4,
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-22'),
  },
  {
    id: '4',
    name: '旧版官网',
    description: '已归档的公司官方网站项目',
    icon: '🌐',
    status: 'archived',
    members: 2,
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2025-12-15'),
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'createdAt'>('updatedAt')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [projects, setProjects] = useState<Project[]>(mockProjects)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCount = projects.filter((p) => p.status === 'active').length
  const archivedCount = projects.filter((p) => p.status === 'archived').length

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">项目管理</h1>
          <p className="text-muted-foreground mt-1">共 {projects.length} 个项目</p>
        </div>

        {/* 筛选区域 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'archived')}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">进行中 ({activeCount})</SelectItem>
              <SelectItem value="archived">已归档 ({archivedCount})</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'updatedAt' | 'createdAt')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">最近更新</SelectItem>
              <SelectItem value="createdAt">创建时间</SelectItem>
              <SelectItem value="name">名称排序</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">显示 {filteredProjects.length} 个项目</div>
          <div className="flex items-center gap-2">
            <Button variant={layout === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setLayout('grid')}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={layout === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setLayout('list')}>
              <List className="h-4 w-4" />
            </Button>
            <Link href="/projects/new">
              <Button className="gap-2">
                <Plus className="h-5 w-5" />
                新建项目
              </Button>
            </Link>
          </div>
        </div>

        {/* 项目列表 */}
        {layout === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{project.icon || '📁'}</span>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate">{project.name}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate mt-1">{project.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/projects/${project.id}`}>
                          <DropdownMenuItem>
                            <FolderOpen className="h-4 w-4 mr-2" />
                            打开项目
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/projects/${project.id}/settings`}>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            项目设置
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-destructive">
                          <Archive className="h-4 w-4 mr-2" />
                          {project.status === 'active' ? '归档' : '取消归档'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* 状态标签 */}
                    <div className="flex items-center gap-2">
                      {project.status === 'active' ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          进行中
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <Archive className="h-3 w-3" />
                          已归档
                        </span>
                      )}
                    </div>

                    {/* 统计信息 */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.members} 人</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* 更新时间 */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>更新于 {project.updatedAt.toLocaleDateString()}</span>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/projects/${project.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          查看详情
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`flex items-center p-4 hover:bg-muted/50 ${index !== filteredProjects.length - 1 ? 'border-b' : ''}`}>
                  <span className="text-3xl mr-4">{project.icon || '📁'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.status === 'active' ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          进行中
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <Archive className="h-3 w-3" />
                          已归档
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{project.members} 人</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{project.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/projects/${project.id}`}>
                        <DropdownMenuItem>
                          <FolderOpen className="h-4 w-4 mr-2" />
                          打开项目
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/projects/${project.id}/settings`}>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          项目设置
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="text-destructive">
                        <Archive className="h-4 w-4 mr-2" />
                        {project.status === 'active' ? '归档' : '取消归档'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {filteredProjects.length === 0 && (
          <Card className="p-12 text-center">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">暂无项目</h3>
            <p className="text-muted-foreground mb-4">{searchQuery ? '没有找到匹配的项目' : '还没有创建任何项目'}</p>
            {!searchQuery && (
              <Link href="/projects/new">
                <Button>创建第一个项目</Button>
              </Link>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
