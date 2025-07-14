-- Neon PostgreSQL 数据库表结构
-- 创建 gists 表

CREATE TABLE IF NOT EXISTS gists (
    id VARCHAR(255) PRIMARY KEY,
    description TEXT NOT NULL,
    filename VARCHAR(255) NOT NULL DEFAULT 'untitled.txt',
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_gists_updated_at ON gists(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_gists_created_at ON gists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gists_filename ON gists(filename);

-- 插入一些示例数据（可选）
-- INSERT INTO gists (id, description, filename, content, created_at, updated_at) VALUES
-- ('sample-1', '示例代码片段', 'hello.js', 'console.log("Hello World!");', extract(epoch from now()) * 1000, extract(epoch from now()) * 1000);

-- 查看表结构
-- \d gists;