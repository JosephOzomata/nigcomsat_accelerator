import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus, Trash2, X, Loader2, FolderPlus, FolderOpen, Images, Video,
  CheckCircle2, AlertTriangle, ChevronRight,
} from 'lucide-react';
import { subscribeCollection, createItem, deleteItem } from '../../services/firestore';
import { uploadImage } from '../../services/cloudinary';
import UploadArea from '../../components/upload/UploadArea';
import PreviewCard from '../../components/upload/PreviewCard';
import UploadButton from '../../components/upload/UploadButton';
import ProgressBar from '../../components/upload/ProgressBar';
import { Field, Input } from '../../components/admin/Field';

const GalleryEditor = () => {
  const [folders, setFolders] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState('');

  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsubFolders = subscribeCollection('galleryFolders', (d) => {
      setFolders([...d].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
      setLoading(false);
    });
    const unsubItems = subscribeCollection('gallery', setItems);
    return () => { unsubFolders(); unsubItems(); };
  }, []);

  /* Hierarchy for sidebar */
  const parents = useMemo(
    () => folders.filter((f) => !f.parent).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [folders]
  );

  const subfoldersOf = (parentName) =>
    folders
      .filter((f) => f.parent === parentName)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const itemsIn = (parent, sub) =>
    items
      .filter((it) => it.parent === parent && (sub ? it.subfolder === sub : !it.subfolder))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const folderItemCount = (parent, sub) =>
    items.filter((it) => it.parent === parent && (sub ? it.subfolder === sub : true)).length;

  const currentItems = selectedParent ? itemsIn(selectedParent, selectedSub) : [];

  /* Create folder */
  const createFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return toast.error('Folder name required');
    if (folders.some((f) => f.name === name && (f.parent || '') === newFolderParent)) {
      return toast.error('That folder already exists at this level');
    }
    try {
      await createItem('galleryFolders', {
        name,
        parent: newFolderParent || null,
        order: (folders.filter((f) => (f.parent || '') === newFolderParent).length) + 1,
      });
      if (!newFolderParent) setSelectedParent(name);
      else { setSelectedParent(newFolderParent); setSelectedSub(name); }
      setNewFolderName('');
      setNewFolderParent('');
      setShowNewFolder(false);
      toast.success('Folder created');
    } catch { toast.error('Failed'); }
  };

  const requestDeleteFolder = (folder) => {
    const count = folderItemCount(folder.parent || folder.name, folder.parent ? folder.name : null);
    const realCount = folder.parent
      ? items.filter((it) => it.parent === folder.parent && it.subfolder === folder.name).length
      : items.filter((it) => it.parent === folder.name).length;

    setConfirmState({
      title: folder.parent ? 'Delete subfolder?' : 'Delete folder?',
      message: `Remove "${folder.name}"${realCount ? ` and its ${realCount} item${realCount > 1 ? 's' : ''}` : ''}? Cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        const toDelete = folder.parent
          ? items.filter((it) => it.parent === folder.parent && it.subfolder === folder.name)
          : items.filter((it) => it.parent === folder.name);
        await Promise.all(toDelete.map((it) => deleteItem('gallery', it.id)));

        // If parent folder, also delete all its subfolders
        if (!folder.parent) {
          const subs = folders.filter((f) => f.parent === folder.name);
          await Promise.all(subs.map((s) => deleteItem('galleryFolders', s.id)));
        }

        await deleteItem('galleryFolders', folder.id);

        if (selectedParent === folder.name) { setSelectedParent(null); setSelectedSub(null); }
        toast.success('Deleted');
      },
    });
  };

  const requestDeleteItem = (item) => setConfirmState({
    title: 'Remove item?',
    message: `Remove "${item.filename || 'this item'}"?`,
    confirmLabel: 'Remove',
    onConfirm: async () => { await deleteItem('gallery', item.id); toast.success('Removed'); },
  });

  const runConfirm = async () => {
    if (!confirmState?.onConfirm) return;
    setConfirming(true);
    try { await confirmState.onConfirm(); setConfirmState(null); }
    catch { toast.error('Delete failed'); }
    finally { setConfirming(false); }
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  const uploadAll = async () => {
    if (!selectedParent) return toast.error('Select a folder first');
    if (!files.length) return toast.error('Select files');
    setUploading(true);
    setProgress(0);
    try {
      let uploaded = 0;
      const baseOrder = currentItems.reduce((max, it) => Math.max(max, it.order ?? 0), 0) + 1;
      for (let i = 0; i < files.length; i++) {
        const { file, isVideo } = files[i];
        const result = await uploadImage(file, isVideo ? 'video' : 'image');
        await createItem('gallery', {
          parent: selectedParent,
          subfolder: selectedSub || '',
          url: result.secure_url,
          publicId: result.public_id,
          type: isVideo ? 'video' : 'image',
          filename: file.name,
          size: file.size,
          order: baseOrder + i,
        });
        uploaded++;
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      toast.success(`${uploaded} file${uploaded > 1 ? 's' : ''} uploaded`);
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setProgress(0);
    } catch (err) { toast.error(err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  if (loading) return <div className="flex items-center gap-2 text-gray-500 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;

  return (
    <>
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white border border-gray-200 rounded-xl overflow-hidden h-fit lg:sticky lg:top-24">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Images className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">Folders</span>
            </div>
            <button onClick={() => { setShowNewFolder(true); setNewFolderParent(''); }} className="p-1.5 rounded-lg hover:bg-gray-100">
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {parents.length === 0 ? (
              <div className="p-4 text-center">
                <FolderPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-3">No folders yet</p>
                <button onClick={() => { setShowNewFolder(true); setNewFolderParent(''); }}
                  className="text-xs font-medium text-gray-900 hover:underline">Create your first</button>
              </div>
            ) : (
              <div className="space-y-0.5">
                {parents.map((parent) => {
                  const subs = subfoldersOf(parent.name);
                  const isParentActive = selectedParent === parent.name && !selectedSub;
                  const totalCount = folderItemCount(parent.name, null);

                  return (
                    <div key={parent.id}>
                      <div onClick={() => { setSelectedParent(parent.name); setSelectedSub(null); }}
                        className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                          isParentActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate flex items-center gap-2">
                            <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
                            {parent.name}
                          </div>
                          <div className={`text-xs ml-5 ${isParentActive ? 'text-white/60' : 'text-gray-400'}`}>
                            {totalCount} item{totalCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); requestDeleteFolder(parent); }}
                          className={`p-1 rounded opacity-0 group-hover:opacity-100 ${
                            isParentActive ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-500'
                          }`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subfolders */}
                      <div className="pl-4 mt-0.5 space-y-0.5">
                        {subs.map((sub) => {
                          const isSubActive = selectedParent === parent.name && selectedSub === sub.name;
                          const subCount = items.filter((it) => it.parent === parent.name && it.subfolder === sub.name).length;
                          return (
                            <div key={sub.id}
                              onClick={() => { setSelectedParent(parent.name); setSelectedSub(sub.name); }}
                              className={`group flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition ${
                                isSubActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                              }`}>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium truncate flex items-center gap-1.5">
                                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                                  {sub.name}
                                </div>
                                <div className={`text-[10px] ml-4.5 ${isSubActive ? 'text-white/60' : 'text-gray-400'}`}>
                                  {subCount} item{subCount !== 1 ? 's' : ''}
                                </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); requestDeleteFolder(sub); }}
                                className={`p-1 rounded opacity-0 group-hover:opacity-100 ${
                                  isSubActive ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-200 text-gray-500'
                                }`}>
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                        <button
                          onClick={() => { setShowNewFolder(true); setNewFolderParent(parent.name); }}
                          className="w-full text-left px-3 py-1 text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Add subfolder
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0">
          {!selectedParent ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FolderPlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">No folder selected</h2>
              <p className="text-sm text-gray-500 mb-6">Create a folder to start organising your gallery.</p>
              <button onClick={() => setShowNewFolder(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                <Plus className="w-4 h-4" /> New Folder
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>{selectedParent}</span>
                    {selectedSub && (<><ChevronRight className="w-3 h-3" /><span>{selectedSub}</span></>)}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedSub || selectedParent}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentItems.length} item{currentItems.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <UploadArea files={files} setFiles={setFiles} disabled={uploading} />
                {files.length > 0 && (
                  <motion.div layout className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (<PreviewCard key={file.id} image={file} remove={removeFile} />))}
                  </motion.div>
                )}
                {uploading && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">Uploading...</span>
                      <span className="text-gray-500">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>
                )}
                {files.length > 0 && !uploading && (
                  <div className="mt-6">
                    <UploadButton onClick={uploadAll} disabled={uploading || !files.length} loading={uploading} count={files.length} />
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Items in this folder</h2>
                {currentItems.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">No items yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentItems.map((item) => (
                      <div key={item.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="relative aspect-square bg-black">
                          {item.type === 'video' ? (
                            <video src={item.url} className="w-full h-full object-cover" muted playsInline preload="metadata" controls />
                          ) : (
                            <img src={item.url} alt={item.filename || ''} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-[10px]">
                            {item.type === 'video' ? <><Video size={10} /> Video</> : 'Image'}
                          </div>
                          <button onClick={() => requestDeleteItem(item)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-gray-500 truncate">{item.filename || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New folder modal */}
      <AnimatePresence>
        {showNewFolder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNewFolder(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">{newFolderParent ? 'New Subfolder' : 'New Folder'}</h2>
                <button onClick={() => setShowNewFolder(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <Field label="Parent folder" hint="Leave blank for top-level folder">
                  <select value={newFolderParent} onChange={(e) => setNewFolderParent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                    <option value="">— Top level —</option>
                    {parents.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </Field>
                <Field label="Folder name">
                  <Input autoFocus value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createFolder()} placeholder="e.g. Gitex 2023" />
                </Field>
              </div>
              <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
                <button onClick={() => setShowNewFolder(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={createFolder} disabled={!newFolderName.trim()}
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50">
                  <CheckCircle2 className="w-4 h-4" /> Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm */}
      <AnimatePresence>
        {confirmState && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !confirming && setConfirmState(null)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{confirmState.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{confirmState.message}</p>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setConfirmState(null)} disabled={confirming}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                <button onClick={runConfirm} disabled={confirming}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 disabled:opacity-60">
                  {confirming && <Loader2 className="w-4 h-4 animate-spin" />}{confirmState.confirmLabel || 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryEditor;