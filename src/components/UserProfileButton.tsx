
import { useState } from 'react';
import { UserRound, LogOut } from 'lucide-react';
import { useUserUsage } from '@/hooks/useUserUsage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const UserProfileButton = () => {
  const { usage, loading } = useUserUsage();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get user email
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUserEmail(session?.user?.email ?? null);
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error('Error logging out: ' + error.message);
    }
  };

  if (!userEmail || loading) return null;

  const freeTrialsLeft = usage?.is_premium ? 'Unlimited' : `${Math.max(0, 5 - (usage?.processed_files_count || 0))}`;
  const userType = usage?.is_premium ? 'Premium User' : 'Free User';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
          <Avatar>
            <AvatarFallback>
              <UserRound className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="font-medium text-foreground">{userEmail}</p>
            <p className="text-sm text-muted-foreground">{userType}</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Free trials left:</span>
              <span className="font-medium">{freeTrialsLeft}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Files processed:</span>
              <span className="font-medium">{usage?.processed_files_count || 0}</span>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="destructive" 
            className="w-full flex items-center gap-2 mt-4"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
