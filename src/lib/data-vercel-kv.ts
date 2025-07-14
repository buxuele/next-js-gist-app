import { kv } from "@vercel/kv";

export interface Gist {
  id: string;
  description: string;
  filename: string;
  content: string;
  created_at: number;
  updated_at: number;
}

const GISTS_KEY = "gists";

/**
 * 从 Vercel KV 加载数据
 */
export async function loadGists(): Promise<Gist[]> {
  try {
    console.log("Loading gists from Vercel KV...");
    const gists = await kv.get<Gist[]>(GISTS_KEY);

    if (!gists || !Array.isArray(gists)) {
      console.log("No gists found in KV, returning empty array");
      return [];
    }

    console.log(`Successfully loaded ${gists.length} gists from KV`);
    return gists;
  } catch (error) {
    console.error("Error loading gists from KV:", error);
    return [];
  }
}

/**
 * 将数据保存到 Vercel KV
 */
export async function saveGists(gists: Gist[]): Promise<void> {
  try {
    await kv.set(GISTS_KEY, gists);
    console.log(`Successfully saved ${gists.length} gists to KV`);
  } catch (error) {
    console.error("Error saving gists to KV:", error);
    throw new Error("Failed to save gists to KV");
  }
}

/**
 * 获取单个 gist
 */
export async function getGist(id: string): Promise<Gist | null> {
  const gists = await loadGists();
  return gists.find((g) => g.id === id) || null;
}

/**
 * 删除单个 gist
 */
export async function deleteGist(id: string): Promise<boolean> {
  const gists = await loadGists();
  const filteredGists = gists.filter((g) => g.id !== id);

  if (gists.length === filteredGists.length) {
    return false; // 没有找到要删除的 gist
  }

  await saveGists(filteredGists);
  return true;
}
