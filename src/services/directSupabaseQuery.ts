
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define the type for user_usage to match the table structure
type UserUsageRow = Tables<'user_usage'>;

export async function getUserUsage(userId: string): Promise<UserUsageRow | null> {
  const { data, error } = await supabase
    .from('user_usage')
    .select('id, processed_files_count, is_premium')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error in getUserUsage:', error);
    return null;
  }
  
  return data;
}

export async function incrementUserFileCount(userId: string, currentCount: number): Promise<boolean> {
  const { error } = await supabase
    .from('user_usage')
    .update({ processed_files_count: currentCount + 1 })
    .eq('id', userId);
  
  if (error) {
    console.error('Error in incrementUserFileCount:', error);
    return false;
  }
  
  return true;
}
