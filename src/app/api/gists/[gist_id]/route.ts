import { NextResponse } from 'next/server';
import { loadGists, saveGists } from '@/lib/data';

export async function GET(
  request: Request,
  context: { params: { gist_id: string } }
) {
  const { gist_id } = context.params; 
  const gists = await loadGists();
  const gist = gists.find(g => g.id === gist_id);

  if (!gist) {
    return NextResponse.json({ error: "Gist not found" }, { status: 404 });
  }
  return NextResponse.json(gist);
}

export async function PUT(
  request: Request,
  context: { params: { gist_id: string } }
) {
  const { gist_id } = context.params;
  const data = await request.json();
  const gists = await loadGists();
  const gistToUpdate = gists.find(gist => gist.id === gist_id);

  if (!gistToUpdate) {
    return NextResponse.json({ error: "Gist not found" }, { status: 404 });
  }

  gistToUpdate.description = data.description ?? gistToUpdate.description;
  gistToUpdate.filename = data.filename ?? gistToUpdate.filename;
  gistToUpdate.content = data.content ?? gistToUpdate.content;
  gistToUpdate.updated_at = Date.now();

  await saveGists(gists);
  return NextResponse.json(gistToUpdate);
}

export async function DELETE(
  request: Request,
  context: { params: { gist_id: string } }
) {
  const { gist_id } = context.params;
  const gists = await loadGists();
  const gistsToKeep = gists.filter(gist => gist.id !== gist_id);

  if (gists.length === gistsToKeep.length) {
    return NextResponse.json({ error: "Gist not found" }, { status: 404 });
  }

  await saveGists(gistsToKeep);
  return NextResponse.json({ message: "删除成功" }); 
}