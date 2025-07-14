import { connect } from "@planetscale/database";

export interface Gist {
  id: string;
  description: string;
  filename: string;
  content: string;
  created_at: number;
  updated_at: number;
}

// PlanetScale 配置
const config = {
  url: process.env.DATABASE_URL!,
};

const conn = connect(config);

/**
 * 从 PlanetScale 加载数据
 */
export async function loadGists(): Promise<Gist[]> {
  try {
    console.log("Loading gists from PlanetScale...");

    const results = await conn.execute(
      "SELECT * FROM gists ORDER BY updated_at DESC"
    );

    const gists = results.rows.map((row) => ({
      id: row.id as string,
      description: row.description as string,
      filename: row.filename as string,
      content: row.content as string,
      created_at: row.created_at as number,
      updated_at: row.updated_at as number,
    }));

    console.log(`Successfully loaded ${gists.length} gists from PlanetScale`);
    return gists;
  } catch (error) {
    console.error("Error loading gists from PlanetScale:", error);
    return [];
  }
}

/**
 * 保存单个 gist 到 PlanetScale
 */
export async function saveGist(gist: Gist): Promise<Gist> {
  try {
    await conn.execute(
      `INSERT INTO gists (id, description, filename, content, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       description = VALUES(description),
       filename = VALUES(filename),
       content = VALUES(content),
       updated_at = VALUES(updated_at)`,
      [
        gist.id,
        gist.description,
        gist.filename,
        gist.content,
        gist.created_at,
        gist.updated_at,
      ]
    );

    console.log("Successfully saved gist to PlanetScale");
    return gist;
  } catch (error) {
    console.error("Error saving gist to PlanetScale:", error);
    throw new Error("Failed to save gist");
  }
}

/**
 * 批量保存（为了兼容现有接口）
 */
export async function saveGists(gists: Gist[]): Promise<void> {
  try {
    // 先清空现有数据
    await conn.execute("DELETE FROM gists");

    // 批量插入新数据
    for (const gist of gists) {
      await conn.execute(
        "INSERT INTO gists (id, description, filename, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          gist.id,
          gist.description,
          gist.filename,
          gist.content,
          gist.created_at,
          gist.updated_at,
        ]
      );
    }

    console.log(`Successfully saved ${gists.length} gists to PlanetScale`);
  } catch (error) {
    console.error("Error batch saving gists:", error);
    throw error;
  }
}

/**
 * 获取单个 gist
 */
export async function getGist(id: string): Promise<Gist | null> {
  try {
    const results = await conn.execute("SELECT * FROM gists WHERE id = ?", [
      id,
    ]);

    if (results.rows.length === 0) {
      return null;
    }

    const row = results.rows[0];
    return {
      id: row.id as string,
      description: row.description as string,
      filename: row.filename as string,
      content: row.content as string,
      created_at: row.created_at as number,
      updated_at: row.updated_at as number,
    };
  } catch (error) {
    console.error("Error getting gist:", error);
    return null;
  }
}

/**
 * 删除单个 gist
 */
export async function deleteGist(id: string): Promise<boolean> {
  try {
    const result = await conn.execute("DELETE FROM gists WHERE id = ?", [id]);

    console.log("Successfully deleted gist from PlanetScale");
    return result.rowsAffected > 0;
  } catch (error) {
    console.error("Error deleting gist:", error);
    return false;
  }
}
