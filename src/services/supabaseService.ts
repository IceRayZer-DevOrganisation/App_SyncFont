import { createClient } from '@supabase/supabase-js';
import { Font, Collection, Device } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
// Ne jamais committer vos vraies clés dans le code ! Utilisez .env

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentification
export const signUp = (email: string, password: string) =>
  supabase.auth.signUp({ email, password });

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const getUser = () => supabase.auth.getUser();

// Devices
export const addDevice = async (device: Omit<Device, 'id'>) => {
  const { data, error } = await supabase.from('devices').insert([device]).select();
  if (error) throw error;
  return data?.[0];
};

export const getDevices = async (userId: string) => {
  const { data, error } = await supabase.from('devices').select('*').eq('user_id', userId);
  if (error) throw error;
  return data as Device[];
};

// Fonts
export const addFont = async (font: Omit<Font, 'id'>) => {
  const { data, error } = await supabase.from('fonts').insert([font]).select();
  if (error) throw error;
  return data?.[0];
};

export const getFonts = async (userId: string) => {
  const { data, error } = await supabase.from('fonts').select('*').eq('user_id', userId);
  if (error) throw error;
  return data as Font[];
};

// Collections
export const addCollection = async (collection: Omit<Collection, 'id'>) => {
  const { data: userData } = await getUser();
  const user = userData?.user;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase.from('collections').insert([{
    user_id: user.id,
    name: collection.name,
    description: collection.description,
    color: collection.color,
  }]).select();
  if (error) throw error;
  return data?.[0];
};

export const getCollections = async () => {
  const { data: userData } = await getUser();
  const user = userData?.user;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase.from('collections').select('*').eq('user_id', user.id);
  if (error) throw error;
  return data as Collection[];
};

export const deleteCollection = async (collectionId: string) => {
  const { error } = await supabase.from('collections').delete().eq('id', collectionId);
  if (error) throw error;
  return true;
};

// Liaison collections-fonts (N-N)
export const addFontToCollection = async (collectionId: string, fontId: string) => {
  const { error } = await supabase.from('collections_fonts').insert([{ collection_id: collectionId, font_id: fontId }]);
  if (error) throw error;
  return true;
};

export const removeFontFromCollection = async (collectionId: string, fontId: string) => {
  const { error } = await supabase.from('collections_fonts').delete().eq('collection_id', collectionId).eq('font_id', fontId);
  if (error) throw error;
  return true;
};

export const getFontsOfCollection = async (collectionId: string) => {
  const { data, error } = await supabase
    .from('collections_fonts')
    .select('font_id, fonts(*)')
    .eq('collection_id', collectionId);
  if (error) throw error;
  // On retourne la liste des polices associées
  return (data || []).map((row: any) => row.fonts);
}; 