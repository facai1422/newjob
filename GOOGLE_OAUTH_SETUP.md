# Google OAuth 配置指南

## 1. 在 Google Cloud Console 创建项目

### 步骤 1: 创建 Google Cloud 项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击"选择项目" → "新建项目"
3. 输入项目名称（例如："Hirely Job Platform"）
4. 点击"创建"

### 步骤 2: 启用 Google+ API
1. 在左侧菜单中，转到"API 和服务" → "库"
2. 搜索"Google+ API"或"Google Identity"
3. 点击并启用该 API

### 步骤 3: 创建 OAuth 2.0 凭据
1. 转到"API 和服务" → "凭据"
2. 点击"创建凭据" → "OAuth 2.0 客户端 ID"
3. 首先需要配置"OAuth 同意屏幕"：
   - 用户类型：选择"外部"
   - 应用名称：输入"Hirely"
   - 用户支持电子邮件：您的邮箱
   - 授权域：添加您的域名（如果有的话）
   - 开发者联系信息：您的邮箱
4. 创建 OAuth 2.0 客户端 ID：
   - 应用类型：选择"Web 应用"
   - 名称：输入"Hirely Web Client"
   - 授权重定向 URI：添加以下 URL
     ```
     https://yobpdwtturkwqrisirdi.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback (开发环境)
     ```

### 步骤 4: 获取客户端凭据
完成后，您会得到：
- 客户端 ID
- 客户端密钥

**保存这些信息，稍后需要在 Supabase 中配置。**

## 2. 在 Supabase 中配置 Google OAuth

### 步骤 1: 访问 Supabase 控制台
1. 登录 [Supabase](https://supabase.com/)
2. 选择您的项目："jobsql"

### 步骤 2: 配置 Google Provider
1. 转到"Authentication" → "Providers"
2. 找到"Google"并点击编辑
3. 启用 Google provider
4. 填入从 Google Cloud Console 获取的：
   - Client ID
   - Client Secret
5. 点击"保存"

### 步骤 3: 配置重定向 URL
确保在 Google Cloud Console 中添加的重定向 URL 与 Supabase 提供的回调 URL 一致：
```
https://yobpdwtturkwqrisirdi.supabase.co/auth/v1/callback
```

## 3. 测试 Google 登录

### 前端代码已配置
✅ ModernAuthForm.tsx - 现代化登录界面
✅ AuthForm.tsx - 传统登录界面

### 测试步骤
1. 启动开发服务器：`npm run dev`
2. 访问：`http://localhost:3000/dashabi/login`
3. 点击"使用 Google 登录"按钮
4. 应该会跳转到 Google 授权页面
5. 授权后会重定向回您的应用

## 4. 常见问题

### 问题 1: "redirect_uri_mismatch" 错误
**解决方案**: 确保 Google Cloud Console 中的重定向 URI 与 Supabase 提供的完全一致。

### 问题 2: "access_denied" 错误
**解决方案**: 检查 OAuth 同意屏幕配置，确保状态为"发布"或"测试"状态下添加了测试用户。

### 问题 3: 本地开发无法使用 Google 登录
**解决方案**: 
1. 确保在 Google Cloud Console 中添加了 `http://localhost:3000` 作为授权域
2. 添加本地重定向 URI：`http://localhost:3000/auth/callback`

## 5. 生产环境配置

### 域名配置
当部署到生产环境时，需要：
1. 在 Google Cloud Console 中添加生产域名到授权域
2. 更新重定向 URI 为生产环境 URL
3. 确保 HTTPS 配置正确

### 安全建议
- 定期轮换客户端密钥
- 限制 OAuth 作用域为必要权限
- 监控授权日志

## 6. 获取用户信息

登录成功后，用户信息会存储在 Supabase 的 `auth.users` 表中，包括：
- email
- name
- avatar_url
- provider (google)

可以通过以下方式获取：
```javascript
const { data: { user } } = await supabase.auth.getUser()
```

---

完成以上配置后，用户就可以使用 Google 账号一键登录您的应用了！
