import { NextResponse } from "next/server";
import { loadGists, saveGists, Gist } from "@/lib/data";
import { validateGistData } from "@/lib/utils";
import { randomUUID } from "crypto";

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

    const gists = await loadGists();
    const newGist: Gist = {
      id: randomUUID(),
      description: data.description,
      filename: data.filename || "untitled.txt",
      content: data.content,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    gists.unshift(newGist); // 添加到开头
    await saveGists(gists);

    return NextResponse.json(newGist, { status: 201 });
  } catch (error) {
    console.error("Error creating gist:", error);
    return NextResponse.json(
      { error: "Failed to create gist" },
      { status: 500 }
    );
  }
}
