"use client"

import { useState } from "react"
import { Settings2, Palette, Monitor, Moon, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

const themeColors = [
  { name: "蓝色", value: "blue", preview: "bg-blue-500" },
  { name: "紫色", value: "purple", preview: "bg-purple-500" },
  { name: "绿色", value: "green", preview: "bg-green-500" },
  { name: "橙色", value: "orange", preview: "bg-orange-500" },
  { name: "红色", value: "red", preview: "bg-red-500" },
  { name: "青色", value: "cyan", preview: "bg-cyan-500" },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    streamingResponse: true,
    showLineNumbers: true,
  })
  const [selectedColor, setSelectedColor] = useState("blue")

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">设置</h1>
          <p className="text-muted-foreground">自定义你的工作环境</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">通用设置</TabsTrigger>
            <TabsTrigger value="appearance">外观</TabsTrigger>
            <TabsTrigger value="advanced">高级</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  常规设置
                </CardTitle>
                <CardDescription>
                  配置应用的基本行为和偏好
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>自动保存</Label>
                    <p className="text-sm text-muted-foreground">
                      自动保存对话历史记录
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      handleSettingChange("autoSave", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>消息通知</Label>
                    <p className="text-sm text-muted-foreground">
                      接收新消息提醒
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>流式响应</Label>
                    <p className="text-sm text-muted-foreground">
                      实时显示 AI 回复内容
                    </p>
                  </div>
                  <Switch
                    checked={settings.streamingResponse}
                    onCheckedChange={(checked) =>
                      handleSettingChange("streamingResponse", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>显示行号</Label>
                    <p className="text-sm text-muted-foreground">
                      在代码块中显示行号
                    </p>
                  </div>
                  <Switch
                    checked={settings.showLineNumbers}
                    onCheckedChange={(checked) =>
                      handleSettingChange("showLineNumbers", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  主题设置
                </CardTitle>
                <CardDescription>
                  自定义应用的外观风格
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>颜色主题</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {themeColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color.value
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:bg-muted"
                        }`}
                      >
                        <div className={`h-8 w-8 rounded ${color.preview}`} />
                        <span className="font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>显示模式</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        theme === "light"
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted"
                      }`}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">浅色</span>
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        theme === "dark"
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted"
                      }`}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">深色</span>
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        theme === "system"
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted"
                      }`}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">跟随系统</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API 配置</CardTitle>
                <CardDescription>
                  配置 AI 服务的 API 密钥和设置
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API 密钥</Label>
                  <input
                    id="api-key"
                    type="password"
                    placeholder="输入你的 API 密钥"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    你的 API 密钥将安全地保存在本地
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-model">模型选择</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger id="api-model">
                      <SelectValue placeholder="选择模型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-base-url">API 基础 URL</Label>
                  <input
                    id="api-base-url"
                    type="text"
                    placeholder="https://api.openai.com/v1"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
