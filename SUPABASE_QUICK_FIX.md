# 🚨 验证码失败 - 立即修复指南

## 问题确认 ✅
错误信息："生成验证码失败，请稍后重试"
**根本原因：Supabase邮箱模板未配置OTP验证码支持**

## 🔧 立即修复步骤

### 步骤1: 访问Supabase邮箱模板设置
**直接链接：** https://supabase.com/dashboard/project/yobpdwtturkwqrisirdi/auth/templates

### 步骤2: 编辑Magic Link模板
1. 找到 **"Magic Link"** 模板
2. 点击编辑按钮
3. 完全替换现有内容

### 步骤3: 复制粘贴以下模板内容

```html
<h2 style="color: #1f2937; text-align: center; margin-bottom: 20px;">🔐 Hirely 验证码</h2>

<div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
    <h3 style="color: white; margin: 0 0 10px; font-size: 18px;">邮箱验证</h3>
    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">请输入验证码完成注册</p>
</div>

<div style="text-align: center; margin-bottom: 20px;">
    <p style="margin: 0 0 15px; font-size: 14px; color: #666;">您的6位验证码：</p>
    
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 25px; border-radius: 8px; display: inline-block; margin-bottom: 10px;">
        <span style="font-size: 32px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 4px;">{{ .Token }}</span>
    </div>
    
    <p style="margin: 0; font-size: 12px; color: #999;">验证码有效期为10分钟</p>
</div>

<hr style="border: none; height: 1px; background-color: #eee; margin: 20px 0;">

<div style="text-align: center; margin-bottom: 20px;">
    <p style="margin: 0 0 10px; font-size: 14px; color: #666;">或点击链接确认：</p>
    <a href="{{ .ConfirmationURL }}" style="color: #3b82f6; text-decoration: none;">确认我的邮箱</a>
</div>

<div style="text-align: center; font-size: 12px; color: #999;">
    <p style="margin: 0;">如果您没有注册，请忽略此邮件</p>
    <p style="margin: 5px 0 0;">© 2025 Hirely</p>
</div>
```

### 步骤4: 保存设置
1. 点击 **"Save"** 保存模板
2. 确认保存成功

### 步骤5: 测试验证码功能
1. 返回您的应用：http://localhost:3000/dashabi/login
2. 尝试注册新账户
3. 应该能收到包含6位验证码的邮件

## ⚡ 更简化的模板 (如果上面的不工作)

```html
<h2>验证码：{{ .Token }}</h2>
<p>请在应用中输入此6位验证码完成注册</p>
<p>或点击链接：<a href="{{ .ConfirmationURL }}">确认邮箱</a></p>
<p>验证码有效期10分钟</p>
```

## 🎯 关键要点

✅ **必须包含 `{{ .Token }}` 变量** - 这是6位验证码  
✅ **保留 `{{ .ConfirmationURL }}` 链接** - 作为备选确认方式  
✅ **保存后立即生效** - 无需重启服务  

## 🔍 验证成功标志

配置正确后，您应该看到：
- ✅ 注册时不再显示"生成验证码失败"
- ✅ 收到包含6位数字验证码的邮件
- ✅ 验证码输入界面正常显示
- ✅ 输入正确验证码后成功注册

## 🆘 如果仍然失败

1. **检查模板是否保存成功**
2. **确认包含 `{{ .Token }}` 变量**
3. **尝试使用更简化的模板**
4. **检查Supabase项目状态是否正常**

## 📞 测试邮箱

使用真实邮箱测试：`supabasedoge@gmail.com`
确保能正常收到邮件。

---

**配置完成后，验证码功能将立即恢复正常！** 🎉
