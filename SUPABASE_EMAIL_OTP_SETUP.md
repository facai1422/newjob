# 🔧 Supabase邮箱OTP验证码配置指南

## 🚨 问题原因
当前遇到"Email address invalid"错误是因为Supabase项目的邮箱模板仍在使用**Magic Link模式**，而我们的代码调用的是`signInWithOtp()`需要**OTP验证码模式**。

## 📋 解决步骤

### 步骤1: 登录Supabase Dashboard
1. 访问：https://supabase.com/dashboard
2. 选择您的项目：**jobsql** (项目ID: yobpdwtturkwqrisirdi)

### 步骤2: 进入邮箱模板设置
1. 在左侧菜单选择 **Authentication**
2. 点击 **Email Templates** 子菜单
3. 或直接访问：https://supabase.com/dashboard/project/yobpdwtturkwqrisirdi/auth/templates

### 步骤3: 修改Magic Link模板
1. 找到 **Magic Link** 模板并点击编辑
2. **当前默认内容** (Magic Link模式):
```html
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p><a href="{{ .ConfirmationURL }}">Log In</a></p>
```

3. **修改为** (OTP验证码模式):
```html
<h2>验证码登录</h2>
<p>您的6位验证码是：</p>
<h1 style="color: #2563eb; font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0;">{{ .Token }}</h1>
<p>请在应用中输入此验证码完成注册/登录。</p>
<p>验证码有效期为10分钟。</p>
<hr>
<p style="color: #666; font-size: 12px;">如果您没有请求此验证码，请忽略此邮件。</p>
```

### 步骤4: 保存设置
1. 点击 **Save** 保存邮箱模板
2. 系统会自动应用新的模板设置

## ✅ 验证配置
配置完成后，测试注册流程：
1. 访问：http://localhost:3000/dashabi/login
2. 切换到注册模式
3. 输入邮箱：supabasedoge@gmail.com 
4. 输入密码并提交
5. 应该收到包含6位验证码的邮件

## 🔄 替代方案
如果您希望同时支持Magic Link和OTP，可以使用以下模板：

```html
<h2>登录验证</h2>

<h3>方式1: 点击链接登录</h3>
<p><a href="{{ .ConfirmationURL }}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">点击此处登录</a></p>

<h3>方式2: 输入验证码</h3>
<p>您的6位验证码是：</p>
<h1 style="color: #2563eb; font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0;">{{ .Token }}</h1>
<p>请在应用中输入此验证码完成注册/登录。</p>

<hr>
<p style="color: #666; font-size: 12px;">验证码有效期为10分钟。如果您没有请求此验证，请忽略此邮件。</p>
```

## 📝 技术说明

### OTP模式的工作原理：
1. `signInWithOtp()` → 发送邮件（包含`{{ .Token }}`）
2. 用户收到6位验证码
3. `verifyOtp()` → 验证验证码并创建会话

### Magic Link模式的工作原理：
1. `signInWithOtp()` → 发送邮件（包含`{{ .ConfirmationURL }}`）
2. 用户点击邮件链接
3. 自动重定向并创建会话

## 🎯 配置完成标志
✅ 邮箱模板包含 `{{ .Token }}` 变量
✅ 保存模板设置成功  
✅ 测试收到验证码邮件
✅ 前端验证码输入界面正常工作

## 🚀 完成后下一步
配置完成后，您的用户就可以：
- 输入邮箱和密码注册
- 收到真实的6位验证码邮件
- 在界面输入验证码完成注册
- 享受安全可靠的验证体验
