import Link from "next/link"
import { ArrowRight, MessageSquare, Settings, Zap, FolderOpen, Users, Wrench, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            欢迎回来 👋
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Work Bot - 你的智能工作助手
          </p>
          <Link href="/chat">
            <Button size="lg" className="gap-2">
              <MessageSquare className="h-5 w-5" />
              开始对话
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <FolderOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>项目管理</CardTitle>
              <CardDescription>
                管理你的所有项目，创建、编辑和配置项目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/projects">
                <Button variant="ghost" className="w-full">
                  查看项目
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>智能对话</CardTitle>
              <CardDescription>
                与 AI 助手进行自然对话，快速解决问题
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button variant="ghost" className="w-full">
                  立即体验
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>成员管理</CardTitle>
              <CardDescription>
                管理团队成员，分配角色和权限
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/members">
                <Button variant="ghost" className="w-full">
                  管理成员
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Wrench className="h-10 w-10 text-primary mb-2" />
              <CardTitle>常用工具</CardTitle>
              <CardDescription>
                快速访问常用的开发工具和实用功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tools">
                <Button variant="ghost" className="w-full">
                  查看工具
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <History className="h-10 w-10 text-primary mb-2" />
              <CardTitle>执行历史</CardTitle>
              <CardDescription>
                查看所有操作记录和执行历史
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/history">
                <Button variant="ghost" className="w-full">
                  查看历史
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-10 w-10 text-primary mb-2" />
              <CardTitle>系统设置</CardTitle>
              <CardDescription>
                配置系统参数、API 密钥和个人偏好
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/settings">
                <Button variant="ghost" className="w-full">
                  前往设置
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
