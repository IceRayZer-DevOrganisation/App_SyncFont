import { Font } from '../types';
import { supabase, getUser } from './supabaseService';

export const addFont = async (font: Omit<Font, 'id'>) => {
  const { data: userData } = await getUser();
  const user = userData?.user;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase.from('fonts').insert([{
    user_id: user.id,
    name: font.name,
    path: font.path,
    category: font.category,
    license: font.license,
  }]).select();
  if (error) throw error;
  return data?.[0];
};

export const getFonts = async () => {
  const { data: userData } = await getUser();
  const user = userData?.user;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase
    .from('fonts')
    .select('*')
    .eq('user_id', user.id);
  if (error) throw error;
  return data as Font[];
};