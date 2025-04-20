
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { getUserUsage, incrementUserFileCount } from '@/services/directSupabaseQuery';

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

    try {
      const data = await getUserUsage(session.user.id);
      return data as UserUsage;
    } catch (error) {
      console.error('Error fetching user usage:', error);
      return null;
    }
  };

  const incrementFileCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    if (!usage) return false;

    try {
      const success = await incrementUserFileCount(session.user.id, usage.processed_files_count);
      
      if (success) {
        setUsage(prev => prev ? {
          ...prev,
          processed_files_count: prev.processed_files_count + 1
        } : null);
      }
      
      return success;
    } catch (error) {
      console.error('Error updating file count:', error);
      return false;
    }
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
