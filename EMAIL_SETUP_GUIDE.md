# 📧 邮箱验证配置指南

## 🎯 概述

本系统支持真实的邮箱验证码注册功能，在开发环境下会显示验证码（用于测试），在生产环境下会发送真实邮件。

## 🔧 邮件服务配置

### 方式 1: Resend (推荐)

Resend 是现代化的邮件发送服务，配置简单且价格合理。

#### 1. 注册 Resend 账户
- 访问 [resend.com](https://resend.com)
- 创建免费账户（每月免费 3000 封邮件）

#### 2. 获取 API Key
- 登录 Resend 控制台
- 进入 "API Keys" 页面
- 创建新的 API Key
- 复制 API Key

#### 3. 配置域名（可选）
- 在 Resend 中添加您的域名
- 配置 DNS 记录验证域名
- 或者使用 Resend 提供的默认域名

#### 4. 设置环境变量
在 Supabase Edge Functions 中设置环境变量：

```bash
# 在 Supabase Dashboard > Project Settings > Environment Variables 中添加
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### 方式 2: SendGrid

#### 1. 注册 SendGrid 账户
- 访问 [sendgrid.com](https://sendgrid.com)
- 创建免费账户

#### 2. 获取 API Key
- 进入 Settings > API Keys
- 创建 Full Access API Key
- 复制 API Key

#### 3. 设置环境变量
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

## 🌟 特性

### ✅ 智能发送策略
- 优先使用 Resend（如果配置）
- 备选 SendGrid（如果配置）
- 兜底模拟发送（开发环境）

### ✅ 安全防护
- 频率限制：5分钟内最多3次
- 邮箱格式验证
- 重复注册检查
- 验证码过期机制（5分钟）

### ✅ 用户体验
- 美观的邮件模板
- 多语言支持
- 详细的错误提示
- 重发验证码功能

### ✅ 开发友好
- 开发环境显示验证码
- 详细的日志记录
- 错误处理和降级方案

## 📋 配置检查清单

### 必须配置
- [x] Supabase 项目已创建
- [x] Edge Functions 已部署
- [x] 数据库表已创建

### 邮件服务（选择一种）
- [ ] Resend API Key 已配置
- [ ] SendGrid API Key 已配置
- [ ] 域名已验证（可选，使用自定义域名）

### 测试步骤
1. [ ] 开发环境测试（应显示验证码）
2. [ ] 生产环境测试（应发送真实邮件）
3. [ ] 频率限制测试
4. [ ] 邮箱格式验证测试

## 🚀 部署步骤

### 1. 更新 Edge Functions
所有必要的 Edge Functions 已经部署：
- `send-verification-code` - 发送验证码
- `verify-code` - 验证验证码并创建用户
- `send-email` - 邮件发送服务

### 2. 配置环境变量
在 Supabase Dashboard 中设置：
```bash
# 选择一个或多个邮件服务
RESEND_API_KEY=your_resend_api_key
SENDGRID_API_KEY=your_sendgrid_api_key

# 环境标识（可选）
DENO_ENVIRONMENT=production
```

### 3. 测试验证
```javascript
// 前端测试代码
const testRegistration = async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  
  const result = await response.json();
  console.log('验证码发送结果:', result);
};
```

## 🔍 故障排除

### 邮件发送失败
1. 检查 API Key 是否正确
2. 检查域名配置
3. 查看 Edge Function 日志
4. 确认邮件服务商账户状态

### 验证码无效
1. 检查验证码是否过期（5分钟）
2. 确认输入的验证码正确
3. 检查数据库中的验证码记录

### 频率限制
- 5分钟内最多发送3次验证码
- 等待时间后重试

## 📊 监控和日志

### 查看发送日志
```sql
-- 查看验证码发送记录
SELECT * FROM user_activities 
WHERE activity_type = 'verification_code_sent' 
ORDER BY created_at DESC 
LIMIT 10;

-- 查看邮件发送状态
SELECT 
  details->>'email' as email,
  details->>'email_sent' as email_sent,
  details->>'email_error' as email_error,
  created_at
FROM user_activities 
WHERE activity_type = 'verification_code_sent';
```

### 查看验证码使用情况
```sql
-- 查看验证码表
SELECT email, code, created_at, expires_at, attempts, is_used
FROM email_verification_codes 
ORDER BY created_at DESC;
```

## 🔐 安全建议

1. **环境变量保护**：确保 API Key 等敏感信息仅在环境变量中配置
2. **域名验证**：使用经过验证的域名发送邮件
3. **频率限制**：已内置频率限制，防止滥用
4. **日志监控**：定期检查发送日志，发现异常及时处理

## 📞 技术支持

如遇到配置问题，请提供以下信息：
- Supabase 项目 ID
- 使用的邮件服务商
- 错误日志截图
- 测试用的邮箱地址

---

✅ **配置完成后，您的用户就可以使用真实的邮箱验证码进行注册了！**
