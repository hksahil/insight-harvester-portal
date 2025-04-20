
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserUsage {
  processed_files_count: number;
  is_premium: boolean;
}

export function useUserUsage() {
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserUsage = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setLoading(false);
      return null;
    }

    const { data, error } = await supabase
      .from('user_usage')
      .select('processed_files_count, is_premium')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user usage:', error);
      return null;
    }

    return data;
  };

  const incrementFileCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;

    const { error } = await supabase
      .from('user_usage')
      .update({ 
        processed_files_count: (usage?.processed_files_count || 0) + 1 
      })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating file count:', error);
      return false;
    }

    setUsage(prev => prev ? {
      ...prev,
      processed_files_count: prev.processed_files_count + 1
    } : null);

    return true;
  };

  useEffect(() => {
    fetchUserUsage().then(data => {
      setUsage(data);
      setLoading(false);
    });
  }, []);

  return {
    usage,
    loading,
    incrementFileCount,
    isLimitReached: !!(usage && !usage.is_premium && usage.processed_files_count >= 5),
  };
}
