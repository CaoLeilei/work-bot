"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MenuItem {
  title: string
  path: string
  icon?: React.ReactNode
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "智能对话",
    path: "/chat",
    icon: <span className="text-lg">💬</span>,
  },
  {
    title: "项目管理",
    path: "/projects",
    icon: <span className="text-lg">📁</span>,
  },
  {
    title: "任务管理",
    path: "/tasks",
    icon: <span className="text-lg">✅</span>,
  },
  {
    title: "常用工具",
    path: "/tools",
    icon: <span className="text-lg">🔧</span>,
  },
  {
    title: "执行历史",
    path: "/history",
    icon: <span className="text-lg">📜</span>,
  },
  {
    title: "设置",
    path: "/settings",
    icon: <span className="text-lg">⚙️</span>,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(path)
  }

  const handleMenuClick = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0
    if (hasChildren) {
      toggleMenu(item.title)
    } else if (item.path) {
      // 有子菜单但点击时跳转到主页面
      window.location.href = item.path
    }
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background z-40">
      <nav className="h-full px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedMenus.has(item.title)
          const active = isActive(item.path)

          return (
            <div key={item.title}>
              <button
                onClick={() => handleMenuClick(item)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                  active && "bg-accent text-accent-foreground"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.title}</span>
                {hasChildren && (
                  <>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </>
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children?.map((child) => {
                    const childActive = pathname === child.path
                    return (
                      <Link
                        key={child.title}
                        href={child.path}
                        className={cn(
                          "block px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                          childActive && "bg-accent text-accent-foreground"
                        )}
                      >
                        {child.title}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
