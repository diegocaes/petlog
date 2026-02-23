import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Upload a pet profile photo to the 'pet-photos' bucket.
 * Returns the public URL, or null if upload fails or no file provided.
 */
export async function uploadPetPhoto(
  file: File | null,
  userId: string,
  supabase: SupabaseClient,
  folder = 'pet-profile',
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = file.name.split('.').pop();
  const filePath = `${userId}/${folder}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('pet-photos')
    .upload(filePath, file, { upsert: true });

  if (error) return null;

  const { data } = supabase.storage.from('pet-photos').getPublicUrl(filePath);
  return data.publicUrl;
}
