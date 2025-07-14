import { NextResponse } from "next/server";
// 我们只从适配器导入真正需要的函数
import { getGist, saveGist, deleteGist } from "@/lib/data-adapter";
import { validateGistData } from "@/lib/utils";

// --- GET 请求 ---
// 使用最简单的函数签名，让 TypeScript 自动推断类型
export async function GET(request: Request, { params }: { params: { gist_id: string } }) {
  try {
    const gist = await getGist(params.gist_id);
    if (!gist) {
      return NextResponse.json({ error: "Gist not found" }, { status: 404 });
    }
    return NextResponse.json(gist);
  } catch (error) {
    console.error(`Error fetching gist ${params.gist_id}:`, error);
    return NextResponse.json({ error: "Failed to fetch gist" }, { status: 500 });
  }
}

// --- PUT 请求 ---
export async function PUT(request: Request, { params }: { params: { gist_id: string } }) {
  try {
    const data = await request.json();
    const validation = validateGistData(data);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(", ") }, { status: 400 });
    }
    
    // 调用 saveGist 进行更新
    const updatedGist = await saveGist({
      id: params.gist_id,
      description: data.description.trim(),
      filename: data.filename?.trim(),
      content: data.content.trim(),
    });

    return NextResponse.json(updatedGist);
  } catch (error) {
    console.error(`Error updating gist ${params.gist_id}:`, error);
    return NextResponse.json({ error: "Failed to update gist" }, { status: 500 });
  }
}

// --- DELETE 请求 (已优化) ---
export async function DELETE(request: Request, { params }: { params: { gist_id: string } }) {
  try {
    // 直接调用适配器的 deleteGist 方法，而不是加载所有数据
    const success = await deleteGist(params.gist_id);

    if (!success) {
      // 如果删除不成功（比如找不到），返回 404
      return NextResponse.json({ error: "Gist not found" }, { status: 404 });
    }

    // 删除成功
    return NextResponse.json({ message: "删除成功" });
  } catch (error) {
    console.error(`Error deleting gist ${params.gist_id}:`, error);
    return NextResponse.json({ error: "Failed to delete gist" }, { status: 500 });
  }
}