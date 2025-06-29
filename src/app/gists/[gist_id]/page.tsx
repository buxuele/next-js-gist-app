import { loadGists, Gist } from '@/lib/data';
import { notFound } from 'next/navigation';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import { GistDetailClientView } from '@/components/GistDetailClientView';

// 这个函数在服务器端运行，根据 ID 获取单个 Gist
async function getGist(id: string): Promise<Gist | undefined> {
  const gists = await loadGists();
  return gists.find(g => g.id === id);
}

// 这个函数会根据 Gist 数据，动态生成页面的标题等元信息
export async function generateMetadata({ params }: { params: { gist_id: string } }) {
  const gist = await getGist(params.gist_id);
  if (!gist) {
    return { title: 'Not Found' };
  }
  return {
    title: `${gist.filename} - 我的知识库`,
    description: gist.description,
  };
}

// 这是详情页的默认导出组件
export default async function GistDetailPage({ params }: { params: { gist_id: string } }) {
  const gist = await getGist(params.gist_id);

  // 如果找不到 Gist，就显示 404 页面
  if (!gist) {
    notFound();
  }

  // 在服务器端就提前把代码高亮处理好
  const lines = gist.content.split('\n');
  const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1).join('\n');
  const highlightedCode = hljs.highlight(gist.content, { 
    language: gist.filename.split('.').pop() || 'plaintext', 
    ignoreIllegals: true 
  }).value;

  // 把处理好的静态数据，传递给客户端组件去负责交互（比如复制按钮）
  return (
    <GistDetailClientView 
      gist={gist} 
      lineNumbers={lineNumbers} 
      highlightedCodeHTML={highlightedCode}
    />
  );
}