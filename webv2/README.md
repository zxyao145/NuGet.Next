# NuGet Next Web v2

NuGet Next 的新版前端，基于 Next.js 16 + TypeScript + Tailwind + Shadc UI 组件构建，用于浏览、上传和管理私有 NuGet 包。

## 功能概览
- 包搜索与浏览：关键字检索、目标框架筛选、预发布过滤；查看版本历史、依赖、下载量、README、许可证、项目链接及安装命令 (.NET CLI、Package Manager、Paket、Script)。
- 包上传：拖拽/选择 `.nupkg` 或 `.snupkg`，自动解析 `.nuspec` 后预览元数据与依赖，再提交到服务端。
- 包管理与审计：个人包列表（删除、跳转详情）、全局/按用户的提交记录列表。
- 密钥管理：生成、启用/禁用、删除用户 API Key（展示为可复制的片段）。
- 文档与体验：内置欢迎页搜索，`/docs` 渲染 `public/docs/*.md`；主题切换（浅色/深色/自动）。
- 管理后台：`/admin` 下的用户管理（新增、删除）、包管理（过滤、删除）与提交记录等视图。

## 运行要求
- Node.js ≥ 18.18（推荐 20+）
- pnpm（`corepack enable` 后可直接使用）
- 需要有 NuGet Next 后端可用；开发模式将 `/api/*`、`/v3/*` 代理到 `http://localhost:5228`，可在 `next.config.ts` 调整或由反向代理处理。

## 快速开始
```bash
cd webv2
pnpm install
pnpm dev           # 默认 http://localhost:5173
```
- 确保后端同时运行并能响应 `/api/v2` 与 `/v3` 路径。
- 登录页 `/login`，默认账户（见仓库根 README）：`admin / Aa123456.`。登录后令牌会以 `X-NuGet-ApiKey` 写入本地存储。

## 构建与质量检查
- `pnpm lint` / `pnpm lint:fix`：ESLint 检查 / 修复 `src`。
- `pnpm format` / `pnpm format:check`：Prettier 写入 / 校验。
- `pnpm build`：生成生产构建。
- `pnpm start`：以生产模式启动（需先 build）。

## 重要目录
- `src/app`：Next.js App Router，`(main)` 为主站路由，`admin` 为后台路由。
- `src/client-app`：主站页面实现（包列表与详情、上传、密钥、历史、文档、登录等）。
- `src/admin`：后台 UI（用户与包管理、审计记录等）。
- `src/services`：与后端的 API 封装，使用 `X-NuGet-ApiKey` 认证；上传走 `/api/v2/package`。
- `src/store`：全局用户 / 主题等状态，令牌与用户信息存于 `localStorage`。
- `src/components`, `src/ui`：共享组件（LobeHub UI、shadcn/ui、Radix 封装等）。
- `public/docs`：Markdown 文档源，`/docs` 页面读取并渲染。
- `next.config.ts`：开发代理配置（与后端联调时需保持同步）。

## 提示
- 如需替换后端地址，请同步修改 `next.config.ts` 中的 rewrites 或在网关层做反向代理。
- 上传 / 删除等操作依赖已登录的 API Key，遇到 401 可清空本地存储并重新登录。
- 自定义文档或隐私策略时，直接更新 `public/docs` 下的 Markdown 文件即可。
