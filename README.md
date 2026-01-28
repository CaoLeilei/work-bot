# Work Bot

一个基于 pnpm Workspace 的全栈项目，前端使用 Next.js，后端使用 Nest.js。

## 项目结构

```
work-bot/
├── packages/
│   ├── frontend/    # Next.js 前端项目
│   └── backend/     # Nest.js 后端项目
├── package.json     # 根 package.json
└── pnpm-workspace.yaml
```

## 安装依赖

```bash
pnpm install
```

## 开发

启动所有服务（前端 + 后端）：

```bash
pnpm dev
```

单独启动前端：

```bash
cd packages/frontend
pnpm dev
```

单独启动后端：

```bash
cd packages/backend
pnpm start:dev
```

## 构建

构建所有项目：

```bash
pnpm build
```

## 生产环境

启动生产环境服务：

```bash
pnpm start
```
