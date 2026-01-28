"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageContentRenderer } from "@/components/chat/message-content"
import { Message, MessageContent } from "@/types/message"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: {
        type: "text",
        data: "你好！我是 Work Bot，你的 AI 工作助手。我可以帮你生成代码、解答问题、优化代码等。有什么我可以帮你的吗？",
      } as MessageContent,
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: {
        type: "text",
        data: input,
      } as MessageContent,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 模拟 AI 回复 - 根据输入返回不同类型的内容
    setTimeout(() => {
      let assistantContent: MessageContent

      if (input.includes("上传") || input.includes("文件")) {
        assistantContent = {
          type: "file-upload",
          data: {
            accept: "image/*,.pdf,.doc,.docx",
            maxSize: 10 * 1024 * 1024,
            multiple: true,
            description: "请上传你的文件（支持图片、PDF、Word 文档）",
          },
        }
      } else if (input.includes("图片") || input.includes("展示")) {
        assistantContent = {
          type: "image",
          data: {
            url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
            alt: "示例图片",
            height: 400,
          },
        }
      } else if (input.includes("代码") || input.includes("code")) {
        assistantContent = {
          type: "code",
          data: {
            code: `function greet(name) {
  return \`Hello, \${name}!\`;
}

// 使用示例
console.log(greet("World"));`,
            language: "javascript",
            filename: "example.js",
          },
        }
      } else if (input.includes("表格") || input.includes("table")) {
        assistantContent = {
          type: "table",
          data: {
            headers: ["姓名", "年龄", "职位"],
            rows: [
              ["张三", 28, "前端工程师"],
              ["李四", 32, "后端工程师"],
              ["王五", 25, "产品经理"],
            ],
          },
        }
      } else if (input.includes("json")) {
        assistantContent = {
          type: "json",
          data: {
            name: "Work Bot",
            version: "1.0.0",
            features: ["对话", "代码生成", "文件上传"],
            config: {
              theme: "dark",
              language: "zh-CN",
            },
          },
        }
      } else {
        assistantContent = {
          type: "text",
          data: `这是一个模拟回复。你发送了："${input}"。\n\n你可以尝试发送以下内容来查看不同的展示效果：\n- "请上传文件"：查看文件上传组件\n- "展示图片"：查看图片展示组件\n- "生成代码"：查看代码块组件\n- "显示表格"：查看表格组件\n- "显示 JSON"：查看 JSON 展示组件`,
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-3.5rem)]">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">对话</h1>
          <p className="text-muted-foreground">与 AI 助手交流，获取帮助</p>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <ScrollArea className="flex-1 rounded-lg border p-4">
            <div className="space-y-2">
              {messages.map((message) => {
                const isUser = message.role === "user"
                const content = isUser && typeof message.content === "object"
                  ? (message.content as MessageContent)
                  : (message.content as MessageContent)

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
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
          </ScrollArea>

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
              className="h-[80px] w-[80px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
