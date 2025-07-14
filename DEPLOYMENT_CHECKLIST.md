# 🚀 Vercel 部署检查清单

## ✅ 部署前检查

### 1. 代码检查

- [x] 删除了所有未使用的依赖引用
- [x] 只保留 Neon 和本地文件存储适配器
- [x] 所有 API 路由正常工作
- [x] 没有构建错误

### 2. 依赖检查

```bash
npm run test:build
```

确保所有必要文件存在且依赖正确。

### 3. 本地构建测试

```bash
npm run build
```

确保本地构建成功。

## 🐘 Neon 数据库设置

### 1. 创建 Neon 项目

1. 访问 https://console.neon.tech/
2. 创建新项目
3. 获取连接字符串

### 2. 创建数据表

在 Neon SQL Editor 中执行：

```sql
CREATE TABLE IF NOT EXISTS gists (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL DEFAULT 'untitled.txt',
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gists_updated_at ON gists(updated_at DESC);
```

### 3. 数据迁移（可选）

如果有现有数据：

```bash
# 设置环境变量
DATABASE_URL=your_neon_connection_string

# 运行迁移
npm run migrate:neon
```

## 🌐 Vercel 部署

### 1. 推送代码

```bash
git add .
git commit -m "Fix build issues and add Neon support"
git push origin main
```

### 2. Vercel 配置

1. 在 Vercel Dashboard 导入项目
2. 设置环境变量：
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

### 3. 部署验证

- [ ] 构建成功
- [ ] 应用可以访问
- [ ] 数据库连接正常
- [ ] CRUD 操作正常

## 🔧 故障排除

### 构建失败

1. 检查是否有未安装的依赖
2. 运行 `npm run test:build` 检查
3. 查看 Vercel 构建日志

### 数据库连接失败

1. 检查 `DATABASE_URL` 环境变量
2. 确认 Neon 数据库状态
3. 检查表是否已创建

### 运行时错误

1. 查看 Vercel Functions 日志
2. 检查 API 路由响应
3. 验证数据格式

## 📊 当前配置

### 数据存储优先级

1. **Neon PostgreSQL** (如果有 `DATABASE_URL`)
2. **本地文件存储** (开发环境默认)

### 主要文件

- `src/lib/data-neon.ts` - Neon 数据库适配器
- `src/lib/data-adapter.ts` - 统一数据接口
- `database/schema.sql` - 数据库表结构
- `scripts/migrate-to-neon.js` - 数据迁移脚本

## 🎯 部署后测试

1. **基本功能**：

   - [ ] 查看 gist 列表
   - [ ] 创建新 gist
   - [ ] 编辑现有 gist
   - [ ] 删除 gist

2. **性能测试**：

   - [ ] 页面加载速度
   - [ ] API 响应时间
   - [ ] 数据库查询性能

3. **错误处理**：
   - [ ] 网络错误处理
   - [ ] 数据验证
   - [ ] 用户友好的错误提示

## 🔄 持续维护

- 定期检查 Neon 数据库使用情况
- 监控 Vercel 函数执行时间
- 备份重要数据
- 更新依赖包版本
