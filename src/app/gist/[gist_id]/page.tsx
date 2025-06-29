import { loadGists, Gist } from '@/lib/data';
import { notFound } from 'next/navigation';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import { GistDetailClientView } from '@/components/GistDetailClientView';

async function getGist(id: string): Promise<Gist | undefined> {
  const gists = await loadGists();
  return gists.find(g => g.id === id);
}

export async function generateMetadata({ params }: { params: { gist_id: string } }) {
  const gist = await getGist(params.gist_id);
  if (!gist) { return { title: 'Not Found' }; }
  return {
    title: `${gist.filename} - 我的知识库`,
    description: gist.description,
  };
}

export default async function GistDetailPage({ params }: { params: { gist_id: string } }) {
  const gist = await getGist(params.gist_id);

  if (!gist) { notFound(); }

  const lines = gist.content.split('\n');
  const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1).join('\n');
  const highlightedCode = hljs.highlight(gist.content, { 
    language: gist.filename.split('.').pop() || 'plaintext', 
    ignoreIllegals: true 
  }).value;

  return (
    <GistDetailClientView 
      gist={gist} 
      lineNumbers={lineNumbers} 
      highlightedCodeHTML={highlightedCode}
    />
  );
}