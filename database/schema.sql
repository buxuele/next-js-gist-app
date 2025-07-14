DROP TABLE IF EXISTS gists;

CREATE TABLE gists (
    id UUID PRIMARY KEY,
    description TEXT,
    filename TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);