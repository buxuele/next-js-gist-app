import { NextResponse } from 'next/server';
import { loadGists, saveGists, Gist } from '@/lib/data';
import crypto from 'crypto'; // 引入 Node.js 内置的加密模块来生成 UUID

// --- GET 方法 (保持不变) ---
export async function GET() {
  const gists: Gist[] = await loadGists();
  const sortedGists = [...gists].sort((a, b) => {
    const timeA = a.updated_at || a.created_at;
    const timeB = b.updated_at || b.created_at;
    return timeB - timeA;
  });
  return NextResponse.json(sortedGists);
}

// --- 新增的 POST 方法 ---
export async function POST(request: Request) {
  // 1. 从请求体中解析 JSON 数据
  // request.json() 相当于 Flask 中的 request.json
  const data = await request.json();

  // 2. 数据校验
  if (!data.content || !data.description) {
    return NextResponse.json(
      { error: "描述和内容是必填项" },
      { status: 400 } // 返回 400 Bad Request 状态码
    );
  }

  // 3. 加载现有的 gists
  const gists = await loadGists();
  
  // 4. 创建新的 Gist 对象
  const currentTimestamp = Date.now(); // JavaScript 中使用 Date.now() 获取毫秒时间戳
  const newGist: Gist = {
    id: crypto.randomUUID(), // 使用内置的 crypto 模块生成一个标准的 UUID
    description: data.description,
    filename: data.filename || 'untitled', // 如果没有提供文件名，给个默认值
    content: data.content,
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  };

  // 5. 将新的 gist 添加到数组并保存
  gists.push(newGist);
  await saveGists(gists); // 等待保存操作完成，确保数据写入成功

  // 6. 将刚刚创建的完整对象返回给前端，并附带 201 Created 状态码
  return NextResponse.json(newGist, { status: 201 });
}