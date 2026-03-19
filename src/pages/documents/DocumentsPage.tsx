import React, { useState, useRef, useCallback } from 'react';
import {
  FileText, Upload, Eye, Pen, CheckCircle, Clock, AlertCircle,
  X, ChevronRight, File, Trash2, Download
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { DealDocument, DocumentStatus } from '../../types';
import { initialDocuments, generateDocId } from '../../data/documents';
import { findUserById } from '../../data/users';

/* ─── Status config ─── */
const statusConfig: Record<DocumentStatus, { label: string; color: string; variant: 'warning' | 'primary' | 'success'; icon: React.ReactNode }> = {
  draft: { label: 'Draft', color: 'text-yellow-600', variant: 'warning', icon: <AlertCircle size={13} /> },
  in_review: { label: 'In Review', color: 'text-blue-600', variant: 'primary', icon: <Clock size={13} /> },
  signed: { label: 'Signed', color: 'text-green-600', variant: 'success', icon: <CheckCircle size={13} /> },
};

/* ─── Signature Pad Modal ─── */
const SignaturePadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (dataUrl: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = getCoords(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setIsDrawing(false);

  const clearPad = () => {
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  };

  const save = () => {
    const dataUrl = canvasRef.current!.toDataURL('image/png');
    onSave(dataUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Pen size={18} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">E-Signature</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">Draw your signature in the box below.</p>
          <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={460}
              height={200}
              className="w-full cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={clearPad}>Clear</Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" onClick={save}>Apply Signature</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Preview Modal ─── */
const PreviewModal: React.FC<{
  doc: DealDocument | null;
  onClose: () => void;
}> = ({ doc, onClose }) => {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Eye size={18} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 truncate">{doc.name}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mock document preview */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 min-h-[300px] space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary-100 rounded-xl">
                <FileText size={24} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{doc.name}</h3>
                <p className="text-xs text-gray-500">{doc.type.toUpperCase()} · {doc.size}</p>
              </div>
            </div>
            {/* Fake document lines */}
            <div className="space-y-2.5">
              {[95, 80, 90, 70, 85, 60, 92, 78, 88, 65, 75, 55].map((w, i) => (
                <div key={i} className="h-2.5 bg-gray-200 rounded-full" style={{ width: `${w}%` }} />
              ))}
            </div>
            {doc.notes && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
                <p className="text-xs font-medium text-primary-800">Notes</p>
                <p className="text-sm text-primary-700 mt-0.5">{doc.notes}</p>
              </div>
            )}
          </div>

          {/* Signature area */}
          {doc.signatureData && (
            <div className="border border-gray-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Signature</p>
              <img src={doc.signatureData} alt="Signature" className="h-16 object-contain" />
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Status</span>
              <div className="mt-1">
                <Badge variant={statusConfig[doc.status].variant}>
                  {statusConfig[doc.status].label}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-gray-500">Owner</span>
              <p className="mt-1 text-gray-900 font-medium">{findUserById(doc.ownerId)?.name || 'Unknown'}</p>
            </div>
            <div>
              <span className="text-gray-500">Created</span>
              <p className="mt-1 text-gray-900">{new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <span className="text-gray-500">Last Updated</span>
              <p className="mt-1 text-gray-900">{new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Upload Zone ─── */
const UploadZone: React.FC<{ onUpload: (name: string) => void }> = ({ onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file.name);
  }, [onUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file.name);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragOver
          ? 'border-primary-400 bg-primary-50'
          : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
        }`}
    >
      <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileSelect} />
      <Upload size={28} className={`mx-auto ${isDragOver ? 'text-primary-500' : 'text-gray-400'}`} />
      <p className="mt-2 text-sm font-medium text-gray-700">Drop files here or click to upload</p>
      <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
    </div>
  );
};

/* ─── Main Document Chamber Page ─── */
export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DealDocument[]>(initialDocuments);
  const [activeFilter, setActiveFilter] = useState<DocumentStatus | 'all'>('all');
  const [signDoc, setSignDoc] = useState<DealDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DealDocument | null>(null);

  if (!user) return null;

  const filtered = activeFilter === 'all' ? documents : documents.filter(d => d.status === activeFilter);

  const statusCounts = {
    all: documents.length,
    draft: documents.filter(d => d.status === 'draft').length,
    in_review: documents.filter(d => d.status === 'in_review').length,
    signed: documents.filter(d => d.status === 'signed').length,
  };

  const handleUpload = (name: string) => {
    const newDoc: DealDocument = {
      id: generateDocId(),
      name,
      type: name.endsWith('.pdf') ? 'pdf' : 'doc',
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      status: 'draft',
      ownerId: user.id,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateStatus = (id: string, status: DocumentStatus) => {
    setDocuments(prev => prev.map(d =>
      d.id === id ? { ...d, status, updatedAt: new Date().toISOString() } : d
    ));
  };

  const handleSign = (dataUrl: string) => {
    if (!signDoc) return;
    setDocuments(prev => prev.map(d =>
      d.id === signDoc.id
        ? { ...d, signatureData: dataUrl, status: 'signed' as DocumentStatus, signedBy: [...(d.signedBy || []), user.id], updatedAt: new Date().toISOString() }
        : d
    ));
    setSignDoc(null);
  };

  const deleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const filters: { key: DocumentStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'draft', label: 'Draft' },
    { key: 'in_review', label: 'In Review' },
    { key: 'signed', label: 'Signed' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FileText size={24} className="text-primary-600" />
            <span>Document Chamber</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage deals, contracts, and agreements</p>
        </div>
      </div>

      {/* Upload zone */}
      <UploadZone onUpload={handleUpload} />

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filters.map(f => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`p-4 rounded-xl border transition-all text-left ${isActive
                  ? 'border-primary-300 bg-primary-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <p className={`text-xs font-medium ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>{f.label}</p>
              <p className={`text-xl font-bold mt-1 ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>{statusCounts[f.key]}</p>
            </button>
          );
        })}
      </div>

      {/* Document list */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            {activeFilter === 'all' ? 'All Documents' : `${statusConfig[activeFilter as DocumentStatus]?.label || ''} Documents`}
          </h2>
        </CardHeader>
        <CardBody>
          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map(doc => {
                const sc = statusConfig[doc.status];
                const owner = findUserById(doc.ownerId);
                return (
                  <div
                    key={doc.id}
                    className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    {/* Icon */}
                    <div className={`p-2.5 rounded-xl mr-4 flex-shrink-0 ${doc.status === 'signed' ? 'bg-green-50' : doc.status === 'in_review' ? 'bg-blue-50' : 'bg-yellow-50'
                      }`}>
                      <File size={20} className={sc.color} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                        <Badge variant={sc.variant} size="sm">
                          <span className="flex items-center space-x-1">
                            {sc.icon}
                            <span>{sc.label}</span>
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{doc.type.toUpperCase()}</span>
                        <span>{doc.size}</span>
                        {owner && <span>by {owner.name}</span>}
                        <span>{new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </button>

                      {doc.status === 'draft' && (
                        <button
                          onClick={() => updateStatus(doc.id, 'in_review')}
                          className="p-2 rounded-lg hover:bg-blue-100 text-blue-500"
                          title="Send for Review"
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}

                      {doc.status === 'in_review' && (
                        <button
                          onClick={() => setSignDoc(doc)}
                          className="p-2 rounded-lg hover:bg-green-100 text-green-600"
                          title="Sign Document"
                        >
                          <Pen size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => { }}
                        className="p-2 rounded-lg hover:bg-gray-200 text-gray-500"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>

                      <button
                        onClick={() => deleteDoc(doc.id)}
                        className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
                <FileText size={22} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No documents in this category</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      <SignaturePadModal
        isOpen={!!signDoc}
        onClose={() => setSignDoc(null)}
        onSave={handleSign}
      />
      <PreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};