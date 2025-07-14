import { createClient } from "@supabase/supabase-js";

export interface Gist {
  id: string;
  description: string;
  filename: string;
  content: string;
  created_at: number;
  updated_at: number;
}

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 从 Supabase 加载数据
 */
export async function loadGists(): Promise<Gist[]> {
  try {
    console.log("Loading gists from Supabase...");

    const { data, error } = await supabase
      .from("gists")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    console.log(`Successfully loaded ${data?.length || 0} gists from Supabase`);
    return data || [];
  } catch (error) {
    console.error("Error loading gists from Supabase:", error);
    return [];
  }
}

/**
 * 保存单个 gist 到 Supabase
 */
export async function saveGist(gist: Gist): Promise<Gist> {
  try {
    const { data, error } = await supabase
      .from("gists")
      .upsert(gist)
      .select()
      .single();

    if (error) {
      console.error("Error saving gist to Supabase:", error);
      throw new Error("Failed to save gist");
    }

    console.log("Successfully saved gist to Supabase");
    return data;
  } catch (error) {
    console.error("Error saving gist:", error);
    throw error;
  }
}

/**
 * 批量保存（为了兼容现有接口）
 */
export async function saveGists(gists: Gist[]): Promise<void> {
  try {
    // 先清空现有数据
    await supabase.from("gists").delete().neq("id", "");

    // 批量插入新数据
    const { error } = await supabase.from("gists").insert(gists);

    if (error) {
      console.error("Error batch saving gists:", error);
      throw new Error("Failed to save gists");
    }

    console.log(`Successfully saved ${gists.length} gists to Supabase`);
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
    const { data, error } = await supabase
      .from("gists")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error getting gist:", error);
      return null;
    }

    return data;
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
    const { error } = await supabase.from("gists").delete().eq("id", id);

    if (error) {
      console.error("Error deleting gist:", error);
      return false;
    }

    console.log("Successfully deleted gist from Supabase");
    return true;
  } catch (error) {
    console.error("Error deleting gist:", error);
    return false;
  }
}
