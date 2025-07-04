"use client";

import { useState, useEffect, useRef } from 'react';
import { Gist } from '@/lib/data';
import type { Modal } from 'bootstrap';

interface GistModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (gistData: Partial<Gist>) => void;
  gistToEdit: Gist | null;
}

export default function GistModal({ show, onClose, onSave, gistToEdit }: GistModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalInstance, setModalInstance] = useState<Modal | null>(null);
  
  const [description, setDescription] = useState('');
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  
  useEffect(() => {
    if (show && gistToEdit) {
      setDescription(gistToEdit.description);
      setFilename(gistToEdit.filename);
      setContent(gistToEdit.content);
    } else if (!show) {
      setDescription('');
      setFilename('');
      setContent('');
    }
  }, [show, gistToEdit]);

  useEffect(() => {
    if (!modalRef.current) return;

    // 只在客户端动态导入 bootstrap
    import('bootstrap').then(bootstrap => {
      const modal = bootstrap.Modal.getOrCreateInstance(modalRef.current!);
      setModalInstance(modal);
    });
    
  }, []); 

  useEffect(() => {
    if (modalInstance) {
      if (show) {
        modalInstance.show();
      } else {
        modalInstance.hide();
      }
    }
  }, [show, modalInstance]);


  const handleSave = () => {
    if (!description || !content) {
      alert("描述和内容是必填项!");
      return;
    }
    onSave({
      id: gistToEdit?.id,
      description,
      filename,
      content,
    });
  };

  // 唯一的改动在这里：移除了那个错误的 onHide={onClose} 属性
  return (
    <div className="modal fade" ref={modalRef} tabIndex={-1} aria-labelledby="gistModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="gistModalLabel">{gistToEdit ? '编辑片段' : '添加新的片段'}</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="gistFilename" className="form-label">文件名 (例如: script.py)</label>
                        <input type="text" className="form-control" id="gistFilename" value={filename} onChange={e => setFilename(e.target.value)} placeholder="script.py" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gistDescription" className="form-label">描述 (这个片段是干嘛的？)</label>
                        <input type="text" className="form-control" id="gistDescription" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gistContent" className="form-label">内容</label>
                        <textarea className="form-control" id="gistContent" rows={15} value={content} onChange={e => setContent(e.target.value)} required></textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>关闭</button>
                    <button type="button" className="btn btn-primary" onClick={handleSave}>保存</button>
                </div>
            </div>
        </div>
    </div>
  );
}