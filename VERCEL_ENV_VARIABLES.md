# 🚀 Vercel 部署环境变量配置

## 📋 必需的环境变量

在Vercel部署时，您需要在项目设置中添加以下环境变量：

### 1. Supabase 配置
```
VITE_SUPABASE_URL=https://yobpdwtturkwqrisirdi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
```

### 2. Google OAuth 配置 (可选，如果在Supabase中配置)
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 3. 构建配置
```
NODE_ENV=production
```

## 🔧 Vercel配置步骤

### 方法1: Vercel Dashboard配置

1. **登录Vercel Dashboard**
   - 访问: https://vercel.com/dashboard
   - 选择您的项目

2. **进入项目设置**
   - 点击项目名称
   - 选择 "Settings" 标签
   - 找到 "Environment Variables" 选项

3. **添加环境变量**
   ```
   Key: VITE_SUPABASE_URL
   Value: https://yobpdwtturkwqrisirdi.supabase.co
   Environments: Production, Preview, Development
   ```

   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
   Environments: Production, Preview, Development
   ```

   ```
   Key: VITE_GOOGLE_CLIENT_ID (可选)
   Value: your-google-client-id.apps.googleusercontent.com
   Environments: Production, Preview, Development
   ```

   ```
   Key: NODE_ENV
   Value: production
   Environments: Production
   ```

4. **保存配置**
   - 点击 "Save" 保存每个环境变量
   - 触发重新部署以应用更改

### 方法2: Vercel CLI配置

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 在项目根目录添加环境变量
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add NODE_ENV production

# 重新部署
vercel --prod
```

### 方法3: 环境变量文件批量导入

创建 `vercel-env.txt` 文件：
```
VITE_SUPABASE_URL=https://yobpdwtturkwqrisirdi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
NODE_ENV=production
```

然后在Vercel Dashboard的Environment Variables页面点击"Import"按钮上传文件。

## 🌍 多环境配置

### Production (生产环境)
```
VITE_SUPABASE_URL=https://yobpdwtturkwqrisirdi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com (可选)
NODE_ENV=production
```

### Preview (预览环境)
```
VITE_SUPABASE_URL=https://yobpdwtturkwqrisirdi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3FyaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
NODE_ENV=development
```

### Development (开发环境)
```
VITE_SUPABASE_URL=https://yobpdwtturkwqrisirdi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvYnBkd3R0dXJrd3JaXNpcmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjY1MTQsImV4cCI6MjA3MDYwMjUxNH0.UAa-hHQ5vbu6Ydf4Wyp7TmUhCwCAcK0KqJjYurhf6Ac
NODE_ENV=development
```

## 🔔 Google OAuth 特别说明

**重要：** 您的项目使用了Google OAuth登录功能，有两种配置方式：

### 方式1: 完全在Supabase中配置 (推荐)
- **无需添加** `VITE_GOOGLE_CLIENT_ID` 环境变量
- Google Client ID和Secret完全在Supabase Dashboard中配置
- 项目代码通过Supabase处理OAuth，无需直接访问Google凭据

### 方式2: 前端直接集成Google SDK
- **需要添加** `VITE_GOOGLE_CLIENT_ID` 环境变量
- 前端代码直接调用Google API
- 需要在Google Cloud Console和Vercel都进行配置

**当前项目使用方式1，所以Google环境变量是可选的。**

## ⚠️ 安全注意事项

### 1. 公开环境变量
- 所有以 `VITE_` 开头的变量都会被打包到客户端代码中
- `VITE_SUPABASE_ANON_KEY` 是匿名密钥，可以公开
- 永远不要在 `VITE_` 变量中放置敏感信息

### 2. 环境隔离
- 生产环境和开发环境使用相同的Supabase项目
- 通过RLS (Row Level Security) 控制数据访问权限
- 不同环境可以使用不同的域名和重定向URL

### 3. 密钥管理
- 定期轮换Supabase密钥
- 监控API使用情况
- 设置适当的使用限制

## 🚀 部署验证

### 部署后检查清单

1. **环境变量验证**
   ```bash
   # 在Vercel控制台检查是否正确设置
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
   console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

2. **功能测试**
   - ✅ 用户注册功能
   - ✅ 邮箱验证码发送
   - ✅ 用户登录功能
   - ✅ 数据库连接
   - ✅ 文件上传功能

3. **性能检查**
   - ✅ 页面加载速度
   - ✅ API响应时间
   - ✅ 资源压缩情况

## 🔧 故障排除

### 常见问题

1. **"Missing Supabase environment variables"错误**
   - 检查环境变量名称是否正确 (VITE_前缀)
   - 确认在所有环境(Production/Preview/Development)都已设置
   - 重新部署项目

2. **Supabase连接失败**
   - 验证URL格式是否正确
   - 检查ANON_KEY是否有效
   - 确认Supabase项目状态正常

3. **构建失败**
   - 检查NODE_ENV是否设置
   - 验证所有依赖是否正确安装
   - 查看构建日志详细错误信息

### 调试技巧

```javascript
// 在部署后添加调试代码
console.log('Environment Check:', {
  nodeEnv: import.meta.env.MODE,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
});
```

## 📱 域名配置

### Supabase重定向URL设置

在Supabase Dashboard中配置以下重定向URL：

```
# 生产环境
https://your-app.vercel.app
https://your-app.vercel.app/**

# 预览环境
https://*.vercel.app
https://*.vercel.app/**

# 开发环境
http://localhost:3000
http://localhost:3000/**
```

## 📋 快速配置清单

- [ ] 在Vercel中设置 `VITE_SUPABASE_URL`
- [ ] 在Vercel中设置 `VITE_SUPABASE_ANON_KEY`
- [ ] 在Vercel中设置 `NODE_ENV=production`
- [ ] 配置Supabase重定向URL
- [ ] 部署项目
- [ ] 测试邮箱验证功能
- [ ] 测试用户注册/登录
- [ ] 验证所有功能正常

## 🎯 优化建议

1. **启用Vercel分析**
   - 监控页面性能
   - 跟踪用户行为
   - 优化加载速度

2. **设置环境分支**
   - main分支 → Production
   - develop分支 → Preview
   - 特性分支 → Development

3. **配置构建优化**
   ```javascript
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "framework": "vite"
   }
   ```

完成以上配置后，您的项目就可以在Vercel上正常运行了！🚀
