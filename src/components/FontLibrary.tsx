import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { getFonts, addFont } from '../services/fontService';
import { useUser } from './UserContext';

const FontLibrary: React.FC = () => {
  const { user } = useUser();
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulaire d'ajout
  const [newFont, setNewFont] = useState({ name: '', category: '', path: '', family: '', style: '', format: 'TTF', deviceId: '', weight: 400, size: 0, dateInstalled: '', license: 'free', userId: '', italic: false, variable: false, preview: '' });

  // Edition
  const [editId, setEditId] = useState<string | null>(null);
  const [editFont, setEditFont] = useState({ name: '', category: '', path: '' });

  // Récupérer les polices
  const fetchFonts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFonts();
      setFonts(data || []);
    } catch (e) {
      setError("Erreur lors de la récupération des polices.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFonts();
    // eslint-disable-next-line
  }, [user]);

  // Ajouter une police
  const handleAddFont = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!newFont.name || !newFont.category || !newFont.path) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    try {
      await addFont({
        ...newFont,
        userId: user?.id || '',
        deviceId: '',
        family: newFont.family || newFont.name,
        style: newFont.style || 'Regular',
        format: 'TTF',
        weight: 400,
        size: 0,
        dateInstalled: new Date().toISOString(),
        license: 'free',
        category: newFont.category as 'serif' | 'sans-serif' | 'monospace' | 'script' | 'display',
      });
      setSuccess('Police ajoutée !');
      setNewFont({ name: '', category: '', path: '', family: '', style: '', format: 'TTF', deviceId: '', weight: 400, size: 0, dateInstalled: '', license: 'free', userId: '', italic: false, variable: false, preview: '' });
      fetchFonts();
    } catch (e) {
      setError("Erreur lors de l'ajout.");
    }
  };

  // Supprimer une police
  const handleDeleteFont = async (id: string) => {
    if (!window.confirm('Supprimer cette police ?')) return;
    setError(null);
    setSuccess(null);
    try {
      // Suppression via Supabase
      // (à ajouter dans fontService si besoin)
      // Ici, on fait directement l'appel
      const { error } = await import('../services/supabaseService').then(m => m.supabase.from('fonts').delete().eq('id', id));
      if (error) setError("Erreur lors de la suppression.");
      else {
        setSuccess('Police supprimée.');
        fetchFonts();
      }
    } catch (e) {
      setError("Erreur lors de la suppression.");
    }
  };

  // Préparer l'édition
  const startEdit = (font: any) => {
    setEditId(font.id);
    setEditFont({ name: font.name, category: font.category, path: font.path });
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditId(null);
    setEditFont({ name: '', category: '', path: '' });
  };

  // Valider l'édition
  const handleEditFont = async (id: string) => {
    setError(null);
    setSuccess(null);
    if (!editFont.name || !editFont.category || !editFont.path) {
      setError('Tous les champs sont obligatoires.');
      return;
    }
    try {
      const { error } = await import('../services/supabaseService').then(m => m.supabase.from('fonts').update(editFont).eq('id', id));
      if (error) setError("Erreur lors de la modification.");
      else {
        setSuccess('Police modifiée !');
        setEditId(null);
        setEditFont({ name: '', category: '', path: '' });
        fetchFonts();
      }
    } catch (e) {
      setError("Erreur lors de la modification.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Bibliothèque de polices</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-2">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-2">{success}</div>}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddFont} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Nom"
          value={newFont.name}
          onChange={e => setNewFont(f => ({ ...f, name: e.target.value }))}
          className="border rounded px-2 py-1 flex-1"
        />
        <select
          value={newFont.category}
          onChange={e => setNewFont(f => ({ ...f, category: e.target.value }))}
          className="border rounded px-2 py-1 flex-1"
        >
          <option value="">Catégorie</option>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="monospace">Monospace</option>
          <option value="script">Script</option>
          <option value="display">Display</option>
        </select>
        <input
          type="text"
          placeholder="Chemin (path)"
          value={newFont.path}
          onChange={e => setNewFont(f => ({ ...f, path: e.target.value }))}
          className="border rounded px-2 py-1 flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-1">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </form>

      {/* Liste des polices */}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <ul className="space-y-3">
          {fonts.map(font => (
            <li key={font.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              {editId === font.id ? (
                <div className="flex flex-col md:flex-row gap-2 flex-1">
                  <input
                    type="text"
                    value={editFont.name}
                    onChange={e => setEditFont(f => ({ ...f, name: e.target.value }))}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <input
                    type="text"
                    value={editFont.category}
                    onChange={e => setEditFont(f => ({ ...f, category: e.target.value }))}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <input
                    type="text"
                    value={editFont.path}
                    onChange={e => setEditFont(f => ({ ...f, path: e.target.value }))}
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <button onClick={() => handleEditFont(font.id)} className="bg-green-600 text-white px-2 py-1 rounded flex items-center"><Check className="w-4 h-4" /></button>
                  <button onClick={cancelEdit} className="bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="font-bold">{font.name}</div>
                    <div className="text-sm text-gray-600">Catégorie : {font.category}</div>
                    <div className="text-sm text-blue-600"><a href={font.path} target="_blank" rel="noopener noreferrer">{font.path}</a></div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button onClick={() => startEdit(font)} className="bg-yellow-400 text-white px-2 py-1 rounded flex items-center" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteFont(font.id)} className="bg-red-600 text-white px-2 py-1 rounded flex items-center" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FontLibrary;