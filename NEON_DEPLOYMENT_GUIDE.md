# 🐘 Neon PostgreSQL + Vercel 部署指南

## 📋 部署步骤

### 1. 创建 Neon 数据库

1. **访问 [Neon Console](https://console.neon.tech/)**
2. **创建新项目**：

   - 选择区域（推荐：US East 1）
   - 项目名称：`next-js-gist-app`
   - 数据库名称：`gists_db`

3. **获取连接字符串**：
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/gists_db?sslmode=require
   ```

### 2. 创建数据库表

在 Neon Console 的 SQL Editor 中执行以下 SQL：

```sql
-- 创建 gists 表
CREATE TABLE IF NOT EXISTS gists (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL DEFAULT 'untitled.txt',
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_gists_updated_at ON gists(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_gists_created_at ON gists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gists_filename ON gists(filename);
```

### 3. 本地开发配置

1. **安装依赖**：

   ```bash
   npm install @neondatabase/serverless
   ```

2. **创建 .env 文件**：

   ```bash
   cp .env.example .env
   ```

3. **配置环境变量**：
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/gists_db?sslmode=require
   ```

### 4. 数据迁移

如果你有现有的 `gists.json` 数据，可以迁移到 Neon：

```bash
npm run migrate:neon
```

### 5. 本地测试

```bash
npm run dev
```

访问 http://localhost:3000 测试应用功能。

### 6. Vercel 部署

1. **推送代码到 GitHub**：

   ```bash
   git add .
   git commit -m "Add Neon database support"
   git push origin main
   ```

2. **在 Vercel 中导入项目**：

   - 访问 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库

3. **配置环境变量**：
   在 Vercel 项目设置中添加：

   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/gists_db?sslmode=require
   ```

4. **部署**：
   Vercel 会自动构建和部署你的应用。

## 🔧 故障排除

### 常见问题

1. **连接超时**：

   - 检查 Neon 数据库是否处于活跃状态
   - 确认连接字符串正确

2. **表不存在**：

   - 确保已在 Neon Console 中执行了 `database/schema.sql`

3. **权限错误**：
   - 检查数据库用户权限
   - 确认连接字符串中的用户名和密码正确

### 调试命令

```bash
# 检查数据库连接
node -e "
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.connect().then(() => console.log('✅ 连接成功')).catch(console.error);
"

# 查看表结构
node -e "
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT * FROM information_schema.tables WHERE table_name = \\'gists\\'')
  .then(r => console.log(r.rows))
  .catch(console.error);
"
```

## 📊 数据库管理

### 查看数据

```sql
SELECT id, description, filename, created_at FROM gists ORDER BY updated_at DESC LIMIT 10;
```

### 清空数据

```sql
DELETE FROM gists;
```

### 备份数据

```sql
COPY gists TO '/tmp/gists_backup.csv' DELIMITER ',' CSV HEADER;
```

## 🚀 性能优化

1. **连接池配置**：

   ```javascript
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

2. **查询优化**：
   - 使用索引
   - 限制返回结果数量
   - 使用分页

## 💰 成本估算

- **Neon Free Tier**：

  - 0.5 GB 存储
  - 100 小时计算时间/月
  - 适合小型项目

- **Neon Pro**：
  - $19/月起
  - 更多存储和计算时间
  - 适合生产环境

## 🔒 安全建议

1. **使用环境变量**：

   - 永远不要在代码中硬编码数据库凭据
   - 使用 Vercel 的环境变量管理

2. **连接安全**：

   - 始终使用 SSL 连接 (`sslmode=require`)
   - 定期轮换数据库密码

3. **访问控制**：
   - 限制数据库用户权限
   - 使用 Neon 的分支功能进行开发/测试

## 📝 下一步

- [ ] 设置数据库备份策略
- [ ] 配置监控和告警
- [ ] 实现数据库迁移版本控制
- [ ] 添加数据验证和清理任务
