import GistList from '@/components/GistList';
import { loadGists } from '@/lib/data';

export default async function HomePage() {
  // 1. 加载所有的 gists
  const gists = await loadGists();
  
  // 2. 确保最新的在最前面
  const sortedGists = [...gists].sort((a, b) => b.updated_at - a.updated_at);

  return (
    <main className="container-fluid mt-4 px-4">
      {/* 3. 把排序后的完整列表传递给 GistList 组件 */}
      <GistList initialGists={sortedGists} />
    </main>
  );
}