import Link from "next/link"
import { ArrowRight, MessageSquare, Settings, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Work Bot
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            智能工作助手，帮助前端开发者提高工作效率
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="gap-2">
                <MessageSquare className="h-5 w-5" />
                开始对话
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="lg" variant="outline" className="gap-2">
                <Settings className="h-5 w-5" />
                设置
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>代码生成</CardTitle>
              <CardDescription>
                自动生成组件、页面和 API 类型定义
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/chat">
                <Button variant="ghost" className="w-full">
                  查看示例
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="h-10 w-10 text-primary mb-2" />
              <CardTitle>个性化设置</CardTitle>
              <CardDescription>
                自定义主题、配置 API 密钥等个性化选项
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
