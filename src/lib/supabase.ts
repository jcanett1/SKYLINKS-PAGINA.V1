import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  service_type?: string;
  address?: string;
  preferred_contact_method?: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase no está configurado. Revisa las variables de entorno.');
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([formData])
    .select();

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }

  return data;
};