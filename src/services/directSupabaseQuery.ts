
import { supabase } from '@/integrations/supabase/client';

// This file contains direct SQL queries that can be used when
// TypeScript definitions are not yet available for new tables

// This function is only needed during development and will be removed
// once proper TypeScript types are generated for the user_usage table
export async function getUserUsage(userId: string) {
  // We're using a raw SQL query to avoid TypeScript errors
  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error in getUserUsage:', error);
    throw error;
  }
  
  return data;
}

export async function incrementUserFileCount(userId: string, currentCount: number) {
  const { error } = await supabase
    .from('user_usage')
    .update({ processed_files_count: currentCount + 1 })
    .eq('id', userId);
  
  if (error) {
    console.error('Error in incrementUserFileCount:', error);
    throw error;
  }
  
  return true;
}
