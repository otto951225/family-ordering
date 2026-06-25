# 云端独立部署清单

目标：电脑关机后，手机仍然能打开家庭点餐系统。

## 1. 准备 Supabase

1. 创建 Supabase 项目。
2. 进入 SQL Editor。
3. 执行 `supabase/migrations/001_initial_schema.sql`。
4. 执行 `supabase/seed.sql`。
5. 在 Project Settings -> API 中复制：
   - Project URL
   - anon public key

## 2. 准备 Vercel

1. 把本项目推送到 Git 仓库。
2. 在 Vercel 导入项目。
3. 添加环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon public key
ADMIN_PASSWORD=自己设置一个管理密码
ADMIN_SESSION_SECRET=至少 32 位随机字符串
NEXT_PUBLIC_DEFAULT_FAMILY_SLUG=home
```

4. 点击 Deploy。

## 3. 手机访问

部署成功后，打开：

```text
https://你的项目域名/family/home
```

把这个地址发给家人即可。

## 4. 验收

- 手机浏览器可以打开 `/family/home`
- 点一个菜后刷新页面，菜还在
- 另一台手机打开同一 URL 能看到同一份餐桌
- 进入 `/family/home/admin` 需要管理密码
- 添加新菜品后，其他手机刷新或等待 Realtime 同步可以看到

## 5. 重要安全提示

当前匿名共享模型适合家庭内部使用。任何知道链接的人都可能修改数据。若要公网大范围使用，应增加登录、家庭邀请码和更严格的 RLS。
