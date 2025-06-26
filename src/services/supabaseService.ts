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
  const { data, error } = await supabase.from('collections').insert([collection]).select();
  if (error) throw error;
  return data?.[0];
};

export const getCollections = async (userId: string) => {
  const { data, error } = await supabase.from('collections').select('*').eq('user_id', userId);
  if (error) throw error;
  return data as Collection[];
}; 