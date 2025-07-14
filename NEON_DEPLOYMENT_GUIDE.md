
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



