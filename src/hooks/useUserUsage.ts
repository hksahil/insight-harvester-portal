
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

  const refetchUsage = async () => {
    setLoading(true);
    const data = await fetchUserUsage();
    setUsage(data);
    setLoading(false);
    return data;
  };

  const incrementFileCount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return false;
    
    try {
      // Get latest usage data before updating
      const latestUsage = await getUserUsage(session.user.id);
      if (!latestUsage) return false;
      
      // Check if user has reached the limit
      if (!latestUsage.is_premium && latestUsage.processed_files_count >= 5) {
        return false;
      }
      
      const success = await incrementUserFileCount(session.user.id, latestUsage.processed_files_count);
      
      if (success) {
        // Update local state
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
    refetchUsage,
    isLimitReached: !!(usage && !usage.is_premium && usage.processed_files_count >= 5),
  };
}
