
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Define the type for user_usage to match the table structure
type UserUsageRow = Tables<'user_usage'>;

export async function getUserUsage(userId: string): Promise<UserUsageRow | null> {
  try {
    const { data, error } = await supabase
      .from('user_usage')
      .select('id, processed_files_count, is_premium')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error in getUserUsage:', error);
      return null;
    }
    
    // If user doesn't have a record yet, create one
    if (!data) {
      const { data: newData, error: insertError } = await supabase
        .from('user_usage')
        .insert({
          id: userId,
          processed_files_count: 0,
          is_premium: false
        })
        .select('id, processed_files_count, is_premium')
        .single();
      
      if (insertError) {
        console.error('Error creating user_usage record:', insertError);
        return null;
      }
      
      return newData;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in getUserUsage:', error);
    return null;
  }
}

export async function incrementUserFileCount(userId: string, currentCount: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_usage')
      .update({ 
        processed_files_count: currentCount + 1
        // Removed updated_at which was causing errors as it doesn't exist in the table
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error in incrementUserFileCount:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in incrementUserFileCount:', error);
    return false;
  }
}
