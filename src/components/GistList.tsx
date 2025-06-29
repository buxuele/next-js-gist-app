"use client";

import { useState } from 'react';
import { Gist } from '@/lib/data';
import GistCard from './GistCard';
import GistModal from './GistModal';
import Link from 'next/link';
import 'highlight.js/styles/atom-one-dark.min.css';

interface GistListProps {
  initialGists: Gist[];
}

export default function GistList({ initialGists }: GistListProps) {
  const [gists, setGists] = useState(initialGists);
  const [showModal, setShowModal] = useState(false);
  const [gistToEdit, setGistToEdit] = useState<Gist | null>(null);

  const handleOpenModal = (gist: Gist | null) => {
    setGistToEdit(gist);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGistToEdit(null);
  };

  const handleSaveGist = async (gistData: Partial<Gist>) => {
    const isEditing = !!gistData.id;
    const url = isEditing ? `/api/gists/${gistData.id}` : '/api/gists';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gistData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存失败');
      }
      
      const savedGist = await response.json();

      if (isEditing) {
        setGists(currentGists => currentGists.map(g => g.id === savedGist.id ? savedGist : g));
      } else {
        setGists(currentGists => [savedGist, ...currentGists]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('保存失败:', error);
      alert((error as Error).message);
    }
  };

  const handleDeleteGist = (idToDelete: string) => {
    setGists(currentGists =>
      currentGists.filter(gist => gist.id !== idToDelete)
    );
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top mb-4">
        <div className="container-fluid px-4">
            <Link className="navbar-brand" href="/">
                <i className="bi bi-grid-1x2-fill"></i> 我的知识库
            </Link>
            <button className="btn btn-success" onClick={() => handleOpenModal(null)}>
                <i className="bi bi-plus-circle"></i> 添加
            </button>
        </div>
      </nav>

      {gists.length === 0 ? (
         <p className="text-center text-muted mt-5">空空如也，快添加你的第一个知识片段吧！</p>
      ) : (
        <div id="gists-container">
          {gists.map(gist => (
            <GistCard
              key={gist.id}
              gist={gist}
              onDelete={handleDeleteGist}
              onEdit={handleOpenModal}
            />
          ))}
        </div>
      )}

      <GistModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveGist}
        gistToEdit={gistToEdit}
      />
    </>
  );
}