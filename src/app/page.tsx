import GistList from '@/components/GistList';
import { loadGists } from '@/lib/data';

interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function HomePage({ searchParams: _searchParams }: HomePageProps) {
  // searchParams 在当前逻辑中未使用，但类型已定义以保持一致性
  // console.log(_searchParams);

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