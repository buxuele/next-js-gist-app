# 🚨 部署故障排除指南

## 问题描述

GitHub OAuth 登录失败，显示 "redirect_uri is not associated with this application" 错误。

## 🔍 问题分析

从错误信息可以看出：

- **Client ID**: `Ov23lifeZ5l1K6OUWOZ6`
- **当前 Redirect URI**: `https://next-js-gist-m1qsr6aao-fanchuangs-projects.vercel.app/api/auth/callback/github`
- **错误原因**: GitHub OAuth 应用配置中没有包含这个回调 URL

## 🛠️ 解决步骤

### 步骤 1: 更新 GitHub OAuth 应用配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "OAuth Apps" 标签
3. 找到你的应用（Client ID: `Ov23lifeZ5l1K6OUWOZ6`）
4. 点击应用名称进入编辑页面
5. 在 **Authorization callback URL** 字段中添加：
   ```
   https://next-js-gist-m1qsr6aao-fanchuangs-projects.vercel.app/api/auth/callback/github
   ```
6. 点击 "Update application" 保存

### 步骤 2: 检查 Vercel 环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 "Settings" → "Environment Variables"
4. 确保设置了以下变量：

| 变量名                 | 值                                                              | 环境       |
| ---------------------- | --------------------------------------------------------------- | ---------- |
| `NEXTAUTH_URL`         | `https://next-js-gist-m1qsr6aao-fanchuangs-projects.vercel.app` | Production |
| `NEXTAUTH_SECRET`      | 你的密钥（至少 32 字符）                                        | Production |
| `GITHUB_CLIENT_ID`     | `Ov23lifeZ5l1K6OUWOZ6`                                          | Production |
| `GITHUB_CLIENT_SECRET` | 你的 GitHub 应用密钥                                            | Production |
| `DATABASE_URL`         | 你的 Neon 数据库连接字符串                                      | Production |

### 步骤 3: 生成 NEXTAUTH_SECRET

如果你还没有 `NEXTAUTH_SECRET`，可以使用以下命令生成：

```bash
# 方法 1: 使用 OpenSSL
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 步骤 4: 重新部署

1. 在 Vercel 中触发重新部署
2. 或者推送一个新的提交到 GitHub

## 🔧 验证配置

运行配置检查脚本：

```bash
npm run check:deployment
```

## 🚀 常见问题解决

### 问题 1: NEXTAUTH_URL 不匹配

**症状**: 回调 URL 不正确
**解决**: 确保 `NEXTAUTH_URL` 与实际部署的域名完全匹配

### 问题 2: 环境变量未生效

**症状**: 环境变量显示为 undefined
**解决**:

1. 检查变量名拼写
2. 确保在正确的环境（Production）中设置
3. 重新部署项目

### 问题 3: GitHub 应用配置延迟

**症状**: 更新后仍然报错
**解决**: GitHub 配置更新可能需要几分钟生效，请稍等再试

## 📋 完整检查清单

- [ ] GitHub OAuth 应用中添加了正确的回调 URL
- [ ] Vercel 中设置了所有必需的环境变量
- [ ] `NEXTAUTH_URL` 与部署域名完全匹配
- [ ] `NEXTAUTH_SECRET` 已设置且足够复杂
- [ ] 项目已重新部署
- [ ] 等待 GitHub 配置生效（2-5 分钟）

## 🆘 如果问题仍然存在

1. 检查 Vercel 部署日志中的错误信息
2. 确认数据库连接是否正常
3. 验证所有环境变量是否正确设置
4. 尝试在本地环境测试 OAuth 流程

## 📞 联系支持

如果按照以上步骤仍无法解决问题，请提供：

1. Vercel 部署日志
2. 浏览器开发者工具中的错误信息
3. GitHub OAuth 应用的配置截图（隐藏敏感信息）
