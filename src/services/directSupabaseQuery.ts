
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
      console.log('No user_usage record found. Creating one for user:', userId);
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
      .update({ processed_files_count: currentCount + 1 })
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

// Create a profile record for a user if one doesn't exist
export async function ensureUserProfile(userId: string, email: string): Promise<boolean> {
  try {
    // First check if profile exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking for profile:', error);
      return false;
    }
    
    // If profile doesn't exist, create one
    if (!data) {
      console.log('No profile found. Creating one for user:', userId);
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception in ensureUserProfile:', error);
    return false;
  }
}
