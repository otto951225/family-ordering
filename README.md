# 家庭点餐系统

一个移动端优先的家庭共享点餐应用。部署到 Vercel 并连接 Supabase 后，家庭成员可以直接用手机访问公网地址，例如：

```text
https://your-project.vercel.app/family/home
```

电脑关机后仍可访问，数据保存在 Supabase。

## 功能

- `/family/home` 默认家庭空间
- 早餐、午餐、晚餐独立餐桌
- 左侧分类、右侧菜品，两列移动端点餐布局
- 菜品加入/取消、餐桌查看、删除、清空、上移/下移
- 确认今日菜单，保存菜单快照
- 菜单复制和 Web Share 分享
- 分类和菜品管理
- 管理密码验证，7 天 Cookie 会话
- 家庭名称和当前浏览器昵称设置
- Supabase 数据库存储和 Realtime 实时同步
- 未配置 Supabase 时自动使用 localStorage 预览模式

## 技术栈

- Next.js 15
- TypeScript
- App Router
- Tailwind CSS
- Radix/shadcn 风格组件
- Supabase PostgreSQL / Realtime / Storage
- Lucide Icons
- Vitest
- Playwright

## 本地运行

推荐使用 pnpm：

```bash
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

如果你的机器有 npm，也可以使用：

```bash
npm install
npm run dev
npm run lint
npm run test
npm run test:e2e
npm run build
```

局域网手机预览：

```bash
pnpm dev:lan
```

然后用手机打开电脑的局域网 IP，例如：

```text
http://192.168.x.x:3000/family/home
```

这只适合本地预览。真正不依赖电脑需要部署到 Vercel。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_DEFAULT_FAMILY_SLUG=home
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`：预留给服务端任务，不能暴露给前端
- `ADMIN_PASSWORD`：管理页密码
- `ADMIN_SESSION_SECRET`：管理 Cookie 签名密钥，生产环境必须使用长随机字符串
- `NEXT_PUBLIC_DEFAULT_FAMILY_SLUG`：默认家庭空间，默认 `home`

## Supabase 配置

1. 创建 Supabase 项目。
2. 打开 Supabase SQL Editor。
3. 执行 `supabase/migrations/001_initial_schema.sql`。
4. 执行 `supabase/seed.sql` 导入默认家庭、分类和菜品。
5. 在 Storage 中创建 bucket，例如 `dish-images`。
6. Realtime 已在 migration 中配置到 publication。
7. 在 Vercel 环境变量中填入 Supabase URL 和 anon key。

## Vercel 部署

1. 把项目推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 中选择 `Add New Project`。
3. 导入该仓库。
4. Framework Preset 选择 Next.js。
5. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `NEXT_PUBLIC_DEFAULT_FAMILY_SLUG=home`
6. 部署完成后打开：

```text
https://你的-vercel-域名/family/home
```

把这个链接发给家人，手机即可独立访问。

## 数据表

- `families`：家庭空间
- `categories`：菜品分类
- `dishes`：菜品
- `dining_tables`：某天某餐次的餐桌
- `dining_table_items`：餐桌内菜品，防止同餐次重复添加同一道菜
- `confirmed_menus`：已确认菜单版本
- `confirmed_menu_items`：确认时的菜品快照

## 安全说明

当前版本面向家庭共享链接场景。migration 中的开发期 RLS 策略允许匿名读写，便于家人无需登录即可共同点餐。

这不适合高安全要求的公开系统。如果要公开推广，需要增加 Supabase Auth、邀请码、家庭成员权限和更严格的 RLS。

## 测试

```bash
pnpm test
pnpm lint
pnpm build
pnpm test:e2e
```

当前单元测试覆盖：

- 同一道菜不能重复加入同一餐桌
- 早餐、午餐、晚餐餐桌隔离
- 确认菜单生成快照
- 空餐桌不能确认
- 停用菜品不在用户端显示
- Supabase 餐桌和菜单映射

## 常见问题

### 为什么手机打不开 `127.0.0.1`？

`127.0.0.1` 只代表当前设备自己。手机打开它时访问的是手机自己，不是电脑。

### 不依赖电脑怎么打开？

部署到 Vercel，并连接 Supabase。之后手机访问 Vercel 域名即可。

### 没配置 Supabase 能运行吗？

可以。本地会使用 localStorage + seed 数据。但多台手机共享和云端持久化需要 Supabase。

### 图片怎么处理？

第一版支持 `emoji:🍚` 占位图，也支持填写稳定图片 URL。后续可用 Supabase Storage 上传真实图片。
