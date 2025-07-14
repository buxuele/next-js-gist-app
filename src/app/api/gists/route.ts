import { NextResponse } from "next/server";
import { loadGists, saveGist } from "@/lib/data-adapter";
import { validateGistData } from "@/lib/utils";

export async function GET() {
  try {
    const gists = await loadGists();
    return NextResponse.json(gists);
  } catch (error) {
    console.error("Error loading gists:", error);
    return NextResponse.json(
      { error: "Failed to load gists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 使用新的验证函数
    const validation = validateGistData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join(", ") },
        { status: 400 }
      );
    }

    // 使用适配器的 saveGist 方法
    const newGist = await saveGist({
      description: data.description,
      filename: data.filename || "untitled.txt",
      content: data.content,
    });

    return NextResponse.json(newGist, { status: 201 });
  } catch (error) {
    console.error("Error creating gist:", error);
    return NextResponse.json(
      { error: "Failed to create gist" },
      { status: 500 }
    );
  }
}
