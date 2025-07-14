import { NextResponse } from "next/server";
import { loadGists, saveGists } from "@/lib/data";
import { validateGistData } from "@/lib/utils";

export async function GET(
  request: Request,
  context: { params: { gist_id: string } }
) {
  try {
    const { gist_id } = context.params;
    const gists = await loadGists();
    const gist = gists.find((g) => g.id === gist_id);

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

    const gists = await loadGists();
    const gistToUpdate = gists.find((gist) => gist.id === gist_id);

    if (!gistToUpdate) {
      return NextResponse.json({ error: "Gist not found" }, { status: 404 });
    }

    gistToUpdate.description = data.description.trim();
    gistToUpdate.filename = data.filename?.trim() || gistToUpdate.filename;
    gistToUpdate.content = data.content.trim();
    gistToUpdate.updated_at = Date.now();

    await saveGists(gists);
    return NextResponse.json(gistToUpdate);
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
