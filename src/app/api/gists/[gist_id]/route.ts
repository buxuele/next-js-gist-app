import { NextResponse } from "next/server";
import { getGist, saveGist, deleteGist } from "@/lib/data-adapter";
import { validateGistData } from "@/lib/utils";

export async function GET(
  request: Request,
  context: { params: { gist_id: string } }
) {
  try {
    const { gist_id } = context.params;
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

export async function PUT(
  request: Request,
  context: { params: { gist_id: string } }
) {
  try {
    const { gist_id } = context.params;
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

export async function DELETE(
  request: Request,
  context: { params: { gist_id: string } }
) {
  try {
    const { gist_id } = context.params;
    const gists = await loadGists();
    const gistsToKeep = gists.filter((gist) => gist.id !== gist_id);

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
