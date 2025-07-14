import { NextResponse } from "next/server";
// 从 data.ts 导入 Gist 类型定义，以确保类型安全
import type { Gist } from "@/lib/data";
// 从适配器导入所有需要用到的数据操作函数
import {
  getGist,
  saveGist,
  loadGists,
  saveGists,
} from "@/lib/data-adapter";
import { validateGistData } from "@/lib/utils";

/**
 * 处理获取单个 Gist 的 GET 请求
 */
export async function GET(
  request: Request,
  { params }: { params: { gist_id: string } } // <- 标准的 Next.js 参数类型
) {
  try {
    const { gist_id } = params; // 直接从解构后的 params 中获取
    const gist = await getGist(gist_id);

    if (!gist) {
      return NextResponse.json({ error: "Gist not found" }, { status: 404 });
    }
    return NextResponse.json(gist);
  } catch (error) {
    console.error("Error fetching gist:", error);
    return NextResponse.json(
      { error: "Failed to fetch gist" },
      { status: 500 }
    );
  }
}

/**
 * 处理更新单个 Gist 的 PUT 请求
 */
export async function PUT(
  request: Request,
  { params }: { params: { gist_id: string } } // <- 标准的 Next.js 参数类型
) {
  try {
    const { gist_id } = params;
    const data = await request.json();

    const validation = validateGistData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    const updatedGist = await saveGist({
      id: gist_id,
      description: data.description.trim(),
      filename: data.filename?.trim(),
      content: data.content.trim(),
    });

    return NextResponse.json(updatedGist);
  } catch (error) {
    console.error("Error updating gist:", error);
    return NextResponse.json(
      { error: "Failed to update gist" },
      { status: 500 }
    );
  }
}

/**
 * 处理删除单个 Gist 的 DELETE 请求
 */
export async function DELETE(
  request: Request,
  { params }: { params: { gist_id: string } } // <- 标准的 Next.js 参数类型
) {
  try {
    const { gist_id } = params;
    const gists = await loadGists();
    
    // 为 filter 回调中的参数指定 Gist 类型，避免 any 错误
    const gistsToKeep = gists.filter((gist: Gist) => gist.id !== gist_id);

    if (gists.length === gistsToKeep.length) {
      return NextResponse.json({ error: "Gist not found" }, { status: 404 });
    }

    await saveGists(gistsToKeep);
    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error("Error deleting gist:", error);
    return NextResponse.json(
      { error: "Failed to delete gist" },
      { status: 500 }
    );
  }
}