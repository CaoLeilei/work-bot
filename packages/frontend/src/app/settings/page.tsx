'use client'

import { useState } from 'react'
import { Monitor, Moon, Sun, Globe, Bell, Database, Lock, ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const settingsNav = [
  { id: 'general', label: '通用', icon: Globe },
  { id: 'notifications', label: '通知', icon: Bell },
  { id: 'appearance', label: '外观', icon: Sun },
  { id: 'account', label: '账户', icon: Lock },
  { id: 'api', label: 'API', icon: Database },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    streamingResponse: true,
    showLineNumbers: true,
    emailNotifications: true,
    soundEnabled: true,
  })

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* 侧边栏 */}
      <aside className="w-64 border-r bg-background">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">设置</h1>
          <nav className="space-y-1">
            {settingsNav.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    activeSection === item.id
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* 内容区域 */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {/* 通用设置 */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">通用设置</h2>
                <p className="text-sm text-muted-foreground">配置应用的基本行为和偏好</p>
              </div>

              <div className="border rounded-lg divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">自动保存</Label>
                    <p className="text-sm text-muted-foreground mt-1">自动保存对话历史记录</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">流式响应</Label>
                    <p className="text-sm text-muted-foreground mt-1">实时显示 AI 回复内容</p>
                  </div>
                  <Switch
                    checked={settings.streamingResponse}
                    onCheckedChange={(checked) => handleSettingChange('streamingResponse', checked)}
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">显示行号</Label>
                    <p className="text-sm text-muted-foreground mt-1">在代码块中显示行号</p>
                  </div>
                  <Switch
                    checked={settings.showLineNumbers}
                    onCheckedChange={(checked) => handleSettingChange('showLineNumbers', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 通知设置 */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">通知设置</h2>
                <p className="text-sm text-muted-foreground">管理如何接收通知</p>
              </div>

              <div className="border rounded-lg divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">消息通知</Label>
                    <p className="text-sm text-muted-foreground mt-1">接收新消息提醒</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">邮件通知</Label>
                    <p className="text-sm text-muted-foreground mt-1">通过邮件接收重要通知</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">提示音</Label>
                    <p className="text-sm text-muted-foreground mt-1">播放通知提示音</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 外观设置 */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">外观设置</h2>
                <p className="text-sm text-muted-foreground">自定义应用的外观风格</p>
              </div>

              <div className="border rounded-lg p-6 space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">显示模式</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        theme === 'light'
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">浅色</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        theme === 'dark'
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">深色</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        theme === 'system'
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">跟随系统</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 账户设置 */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">账户设置</h2>
                <p className="text-sm text-muted-foreground">管理你的账户信息</p>
              </div>

              <div className="border rounded-lg divide-y">
                <div className="p-4">
                  <Label className="text-base font-medium mb-2 block">用户名</Label>
                  <Input defaultValue="WorkBot User" />
                </div>

                <div className="p-4">
                  <Label className="text-base font-medium mb-2 block">邮箱</Label>
                  <Input type="email" defaultValue="user@workbot.com" />
                </div>

                <button className="w-full p-4 flex items-center justify-between hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-base font-medium">修改密码</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* API 设置 */}
          {activeSection === 'api' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">API 配置</h2>
                <p className="text-sm text-muted-foreground">配置 AI 服务的 API 密钥和设置</p>
              </div>

              <div className="border rounded-lg divide-y">
                <div className="p-4">
                  <Label className="text-base font-medium mb-2 block">API 密钥</Label>
                  <Input type="password" placeholder="输入你的 API 密钥" />
                  <p className="text-xs text-muted-foreground mt-2">你的 API 密钥将安全地保存在本地</p>
                </div>

                <div className="p-4">
                  <Label className="text-base font-medium mb-2 block">模型选择</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
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

                <div className="p-4">
                  <Label className="text-base font-medium mb-2 block">API 基础 URL</Label>
                  <Input type="text" placeholder="https://api.openai.com/v1" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
