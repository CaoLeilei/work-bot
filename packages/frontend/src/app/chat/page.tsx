'use client'

import { useState } from 'react'
import { Send, Plus, MessageSquare, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MessageContentRenderer } from '@/components/chat/message-content'
import { Message, MessageContent } from '@/types/message'

interface ChatHistory {
  id: string
  title: string
  createdAt: Date
}

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: '1', title: '对话 1', createdAt: new Date() },
    { id: '2', title: '对话 2', createdAt: new Date(Date.now() - 86400000) },
    { id: '3', title: '对话 3', createdAt: new Date(Date.now() - 172800000) },
  ])
  const [currentChatId, setCurrentChatId] = useState('1')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: {
        type: 'text',
        data: '你好！我是 Work Bot，你的 AI 工作助手。我可以帮你生成代码、解答问题、优化代码等。有什么我可以帮你的吗？',
      } as MessageContent,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: {
        type: 'text',
        data: input,
      } as MessageContent,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // 模拟 AI 回复 - 根据输入返回不同类型的内容
    setTimeout(() => {
      let assistantContent: MessageContent

      if (input.includes('上传') || input.includes('文件')) {
        assistantContent = {
          type: 'file-upload',
          data: {
            accept: 'image/*,.pdf,.doc,.docx',
            maxSize: 10 * 1024 * 1024,
            multiple: true,
            description: '请上传你的文件（支持图片、PDF、Word 文档）',
          },
        }
      } else if (input.includes('图片') || input.includes('展示')) {
        assistantContent = {
          type: 'image',
          data: {
            url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
            alt: '示例图片',
            height: 400,
          },
        }
      } else if (input.includes('代码') || input.includes('code')) {
        assistantContent = {
          type: 'code',
          data: {
            code: `function greet(name) {
  return \`Hello, \${name}!\`;
}

// 使用示例
console.log(greet("World"));`,
            language: 'javascript',
            filename: 'example.js',
          },
        }
      } else if (input.includes('表格') || input.includes('table')) {
        assistantContent = {
          type: 'table',
          data: {
            headers: ['姓名', '年龄', '职位'],
            rows: [
              ['张三', 28, '前端工程师'],
              ['李四', 32, '后端工程师'],
              ['王五', 25, '产品经理'],
            ],
          },
        }
      } else if (input.includes('json')) {
        assistantContent = {
          type: 'json',
          data: {
            name: 'Work Bot',
            version: '1.0.0',
            features: ['对话', '代码生成', '文件上传'],
            config: {
              theme: 'dark',
              language: 'zh-CN',
            },
          },
        }
      } else {
        assistantContent = {
          type: 'text',
          data: `这是一个模拟回复。你发送了："${input}"。\n\n你可以尝试发送以下内容来查看不同的展示效果：\n- "请上传文件"：查看文件上传组件\n- "展示图片"：查看图片展示组件\n- "生成代码"：查看代码块组件\n- "显示表格"：查看表格组件\n- "显示 JSON"：查看 JSON 展示组件`,
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    const newChatId = Date.now().toString()
    const newChat: ChatHistory = {
      id: newChatId,
      title: '新对话',
      createdAt: new Date(),
    }
    setChatHistory([newChat, ...chatHistory])
    setCurrentChatId(newChatId)
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: {
          type: 'text',
          data: '你好！我是 Work Bot，你的 AI 工作助手。我可以帮你生成代码、解答问题、优化代码等。有什么我可以帮你的吗？',
        } as MessageContent,
      },
    ])
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatHistory(chatHistory.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId && chatHistory.length > 1) {
      const remainingChats = chatHistory.filter((chat) => chat.id !== chatId)
      setCurrentChatId(remainingChats[0].id)
    }
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return '今天'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天'
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* 左侧侧边栏 */}
      <div
        className={`transition-all duration-300 border-r bg-background ${
          sidebarOpen ? 'w-72' : 'w-0'
        } overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* 顶部按钮 */}
          <div className="p-4">
            <Button onClick={handleNewChat} className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              新建对话
            </Button>
          </div>

          <Separator />

          {/* 对话列表 */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-primary/10 text-foreground'
                      : 'hover:bg-muted'
                  }`}>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(chat.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDeleteChat(chat.id, e)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* 右侧主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MessageSquare className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">对话</h1>
              <p className="text-sm text-muted-foreground">
                与 AI 助手交流，获取帮助
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* 对话内容区 */}
        <div className="flex-1 flex flex-col gap-4 min-h-0 p-4">
          <ScrollArea className="flex-1 rounded-lg border">
            <div className="p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => {
                  const isUser = message.role === 'user'
                  const content =
                    isUser && typeof message.content === 'object'
                      ? (message.content as MessageContent)
                      : (message.content as MessageContent)

                  return (
                    <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      {isUser ? (
                        <Card className="max-w-[80%] bg-primary text-primary-foreground">
                          <div className="p-3">
                            <MessageContentRenderer content={content} />
                          </div>
                        </Card>
                      ) : (
                        <div className="max-w-[80%] space-y-2">
                          <MessageContentRenderer content={content} />
                        </div>
                      )}
                    </div>
                  )
                })}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="bg-muted max-w-[80%]">
                      <div className="p-3">
                        <p className="text-muted-foreground text-sm">正在思考...</p>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <div className="max-w-4xl mx-auto w-full">
            <div className="flex gap-2">
              <Textarea
                placeholder="输入消息... (按 Enter 发送，Shift + Enter 换行)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] max-h-[200px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[80px] w-[80px]">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
